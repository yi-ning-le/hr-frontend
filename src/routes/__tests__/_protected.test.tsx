import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Route as RootRoute } from "../__root";
import { beforeLoadGuard, Route } from "../_protected";

// Mock window.matchMedia for Toaster/Sonner
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock child components to verify structural nesting
vi.mock("@/components/layout/Header", () => ({
  Header: () => <header data-testid="layout-header">Header</header>,
}));

vi.mock("@/components/layout/Footer", () => ({
  Footer: () => <footer data-testid="layout-footer">Footer</footer>,
}));

// Dynamic mock for store
const mockGetState = vi.fn();
const mockFetchUserRoles = vi.fn();

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: {
    getState: () => mockGetState(),
  },
}));

describe("ProtectedLayout", () => {
  beforeEach(() => {
    mockGetState.mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "test" },
      roles: { isInterviewer: false },
      fetchUserRoles: mockFetchUserRoles,
    });
    mockFetchUserRoles.mockClear();
  });

  it("renders with correct flexbox structure for sticky footer", async () => {
    // Setup a minimal router for testing the Protected Layout
    const router = createRouter({
      routeTree: RootRoute.addChildren([Route]),
      history: createMemoryHistory(),
    });

    render(<RouterProvider router={router} />);

    // Get the main layout container
    const header = await screen.findByTestId("layout-header");
    const layoutContainer = header.parentElement;

    expect(layoutContainer).toHaveClass("min-h-screen", "flex", "flex-col");

    const main = layoutContainer?.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("flex-1");
  });
});

describe("beforeLoadGuard", () => {
  beforeEach(() => {
    mockFetchUserRoles.mockClear();
  });

  it("redirects if not authenticated", () => {
    mockGetState.mockReturnValue({ isAuthenticated: false });
    // redirect throws an error/object in TanStack Router
    expect(() => beforeLoadGuard()).toThrow();
  });

  it("fetches roles if user exists but roles are missing", async () => {
    mockGetState.mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "test" },
      roles: null,
      fetchUserRoles: mockFetchUserRoles,
    });

    await beforeLoadGuard();

    expect(mockFetchUserRoles).toHaveBeenCalled();
  });

  it("does not fetch roles if roles exist", async () => {
    mockGetState.mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "test" },
      roles: { isInterviewer: false },
      fetchUserRoles: mockFetchUserRoles,
    });

    await beforeLoadGuard();

    expect(mockFetchUserRoles).not.toHaveBeenCalled();
  });
});
