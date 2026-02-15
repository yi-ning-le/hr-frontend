// @vitest-environment jsdom
import {
  createMemoryHistory,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { userRoleQueryOptions } from "@/hooks/useUserRole";
import { queryClient } from "@/lib/queryClient";
import { AdminTabId } from "@/pages/admin/constants";
import { SettingsTabId } from "@/pages/settings/constants";
import { Route as RootRoute } from "../../__root";
import { Route as ProtectedRoute } from "../../_protected";
import { Route as SettingsRoute } from "../settings";

// Mock window.matchMedia for Toaster/Sonner
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock dependent components
vi.mock("@/pages/settings/SettingsPage", () => ({
  SettingsPage: ({ activeTab }: { activeTab: string }) => (
    <div data-testid="settings-page">Settings Page: {activeTab}</div>
  ),
}));

vi.mock("@/components/layout/Header", () => ({
  Header: () => <div>Header</div>,
}));

vi.mock("@/components/layout/Footer", () => ({
  Footer: () => <div>Footer</div>,
}));

// Mock AuthStore
const mockGetState = vi.fn();
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: {
    getState: () => mockGetState(),
  },
}));

describe("Settings Route Validation", () => {
  beforeEach(() => {
    mockGetState.mockReturnValue({
      isAuthenticated: true,
    });
    // Default: Non-recruiter
    queryClient.setQueryData(userRoleQueryOptions().queryKey, {
      isAdmin: false,
      isInterviewer: false,
      isRecruiter: false,
      isHR: false,
      canReviewResumes: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const createTestRouter = (initialUrl: string) => {
    const AdminRoute = createRoute({
      getParentRoute: () => ProtectedRoute,
      path: "/admin",
      component: () => <div data-testid="admin-page">Admin Page</div>,
    });

    return createRouter({
      routeTree: RootRoute.addChildren([
        ProtectedRoute.addChildren([SettingsRoute, AdminRoute]),
      ]),
      history: createMemoryHistory({
        initialEntries: [initialUrl],
      }),
    });
  };

  it("accepts valid tab parameter (General)", async () => {
    const router = createTestRouter(`/settings?tab=${SettingsTabId.General}`);
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId("settings-page")).toHaveTextContent(
        `Settings Page: ${SettingsTabId.General}`,
      );
    });
  });

  it("redirects non-recruiter from candidate-statuses to general", async () => {
    const router = createTestRouter(
      `/settings?tab=${SettingsTabId.CandidateStatuses}`,
    );
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId("settings-page")).toHaveTextContent(
        `Settings Page: ${SettingsTabId.General}`,
      );
      expect(router.state.location.search).toEqual({
        tab: SettingsTabId.General,
      });
    });
  });

  it("handles missing tab parameter by redirecting non-recruiter to general", async () => {
    const router = createTestRouter("/settings");
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      // Missing tab defaults to CandidateStatuses in schema, then redirects to General
      expect(screen.getByTestId("settings-page")).toHaveTextContent(
        `Settings Page: ${SettingsTabId.General}`,
      );
    });
  });

  it("replaces invalid tab parameter with default via catch, then redirects to general for non-recruiter", async () => {
    const router = createTestRouter("/settings?tab=invalid-tab-name");
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      // Invalid -> CandidateStatuses (catch) -> General (redirect)
      expect(screen.getByTestId("settings-page")).toHaveTextContent(
        `Settings Page: ${SettingsTabId.General}`,
      );
    });
  });

  it("allows recruiter to access candidate-statuses", async () => {
    queryClient.setQueryData(userRoleQueryOptions().queryKey, {
      isAdmin: false,
      isInterviewer: false,
      isRecruiter: true, // Recruiter
      isHR: false,
      canReviewResumes: false,
    });

    const router = createTestRouter(
      `/settings?tab=${SettingsTabId.CandidateStatuses}`,
    );
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId("settings-page")).toHaveTextContent(
        `Settings Page: ${SettingsTabId.CandidateStatuses}`,
      );
    });
  });

  it("redirects legacy admin tabs to /admin", async () => {
    queryClient.setQueryData(userRoleQueryOptions().queryKey, {
      isAdmin: true,
      isInterviewer: false,
      isRecruiter: false,
      isHR: false,
      canReviewResumes: false,
    });

    const router = createTestRouter(`/settings?tab=${AdminTabId.Recruiters}`);
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId("admin-page")).toBeInTheDocument();
      expect(router.state.location.pathname).toBe("/admin");
    });
  });
});
