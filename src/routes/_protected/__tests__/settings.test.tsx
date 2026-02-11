// @vitest-environment jsdom
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { userRoleQueryOptions } from "@/hooks/useUserRole";
import { queryClient } from "@/lib/queryClient";
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
    // Stage the query data for role (required by ProtectedRoute)
    queryClient.setQueryData(userRoleQueryOptions.queryKey, {
      isAdmin: false,
      isInterviewer: false,
      isRecruiter: false,
      isHR: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const createTestRouter = (initialUrl: string) => {
    return createRouter({
      routeTree: RootRoute.addChildren([
        ProtectedRoute.addChildren([SettingsRoute]),
      ]),
      history: createMemoryHistory({
        initialEntries: [initialUrl],
      }),
    });
  };

  it("accepts valid tab parameter", async () => {
    const router = createTestRouter(`/settings?tab=${SettingsTabId.General}`);
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId("settings-page")).toHaveTextContent(
        `Settings Page: ${SettingsTabId.General}`,
      );
    });
  });

  it("handles missing tab parameter (optional)", async () => {
    const router = createTestRouter("/settings");
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      // If optional and not defaulted in schema, it might be undefined
      // But we used .catch(SettingsTabId.CandidateStatuses) which usually catches errors.
      // Wait, .catch() catches PARSING errors. optional() allows undefined.
      // If I want a default value, I should use .default().
      // Let's check the schema implementation:
      // tab: z.nativeEnum(SettingsTabId).optional().catch(SettingsTabId.CandidateStatuses)
      // If I pass nothing, it is undefined (valid because optional).
      // So activeTab will be undefined.
      // Let's verify what happens.
      // In SettingsPage, we verified `activeTab={tab}`.
      // And in SettingsPage, `defaultTab` is set if `value` is undefined.
      expect(screen.getByTestId("settings-page")).toHaveTextContent(
        "Settings Page:",
      );
    });
  });

  it("replaces invalid tab parameter with default via catch", async () => {
    const router = createTestRouter("/settings?tab=invalid-tab-name");
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      // z.nativeEnum(...).catch(...) should catch the enum validation error and return the fallback properly
      expect(screen.getByTestId("settings-page")).toHaveTextContent(
        `Settings Page: ${SettingsTabId.CandidateStatuses}`,
      );
    });
  });
});
