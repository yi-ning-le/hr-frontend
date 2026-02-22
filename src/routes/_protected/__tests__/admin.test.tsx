// @vitest-environment jsdom
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { userRoleQueryOptions } from "@/hooks/useUserRole";
import { queryClient } from "@/lib/queryClient";
import { AdminTabId } from "@/pages/admin/constants";
import { Route as RootRoute } from "../../__root";
import { Route as ProtectedRoute } from "../../_protected";
import { Route as AdminRoute } from "../admin";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock("@/components/layout/AdminHeader", () => ({
  AdminHeader: () => <div data-testid="admin-header">Admin Header</div>,
}));

vi.mock("@/components/layout/Footer", () => ({
  Footer: () => <div data-testid="admin-footer">Footer</div>,
}));

vi.mock("@/pages/admin/AdminPage", () => ({
  AdminPage: ({
    activeTab,
    onTabChange,
  }: {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
  }) => (
    <div>
      <div data-testid="admin-page">Admin Page: {activeTab}</div>
      <button
        type="button"
        onClick={() => onTabChange?.(AdminTabId.HRManagement)}
      >
        switch-tab
      </button>
    </div>
  ),
}));

const mockGetState = vi.fn();
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: {
    getState: () => mockGetState(),
  },
}));

describe("Admin Route", () => {
  beforeEach(() => {
    mockGetState.mockReturnValue({
      isAuthenticated: true,
    });
    queryClient.setQueryData(userRoleQueryOptions().queryKey, {
      isAdmin: true,
      isInterviewer: false,
      isHR: false,
      isRecruiter: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const createTestRouter = (initialUrl: string) =>
    createRouter({
      routeTree: RootRoute.addChildren([
        ProtectedRoute.addChildren([AdminRoute]),
      ]),
      history: createMemoryHistory({
        initialEntries: [initialUrl],
      }),
    });

  it("accepts valid tab query and renders admin layout", async () => {
    const router = createTestRouter(`/admin?tab=${AdminTabId.HRManagement}`);

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId("admin-header")).toBeInTheDocument();
      expect(screen.getByTestId("admin-footer")).toBeInTheDocument();
      expect(screen.getByTestId("admin-page")).toHaveTextContent(
        `Admin Page: ${AdminTabId.HRManagement}`,
      );
    });
  });

  it("falls back to recruiters tab when query is invalid", async () => {
    const router = createTestRouter("/admin?tab=invalid-tab");

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId("admin-page")).toHaveTextContent(
        `Admin Page: ${AdminTabId.Recruiters}`,
      );
    });
  });

  it("updates route search when tab changes", async () => {
    const user = userEvent.setup();
    const router = createTestRouter(`/admin?tab=${AdminTabId.Recruiters}`);

    render(<RouterProvider router={router} />);
    await user.click(await screen.findByRole("button", { name: "switch-tab" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/admin");
      expect(router.state.location.search.tab).toBe(AdminTabId.HRManagement);
    });
  });
});
