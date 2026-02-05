import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Route } from "../_protected";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Route as RootRoute } from "../__root";

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

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: {
    getState: () => ({ isAuthenticated: true }),
  },
}));

describe("ProtectedLayout", () => {
  it("renders with correct flexbox structure for sticky footer", async () => {
    // Setup a minimal router for testing the Protected Layout
    const router = createRouter({
      routeTree: RootRoute.addChildren([Route]),
      history: createMemoryHistory(),
    });

    render(<RouterProvider router={router} />);

    // Get the main layout container
    // We expect the layout to be the parent of header, main, and footer
    const header = await screen.findByTestId("layout-header");
    const layoutContainer = header.parentElement;

    expect(layoutContainer).toHaveClass("min-h-screen", "flex", "flex-col");

    // Get the main content area (which is implicitly the Outlet in the real app,
    // but in the tested structure it wraps the Outlet)
    // Based on the code: <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    // We need to verify THIS element has flex-1
    const main = layoutContainer?.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("flex-1");
  });
});
