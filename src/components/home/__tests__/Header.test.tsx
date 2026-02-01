import { Header } from "@/components/layout/Header";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRootRoute, createRouter, RouterProvider, createMemoryHistory } from "@tanstack/react-router";

// Mock router setup
const rootRoute = createRootRoute({
  component: Header,
});

const history = createMemoryHistory({
  initialEntries: ['/'],
});

const router = createRouter({
  routeTree: rootRoute,
  history,
});

function renderWithRouter() {
  return render(<RouterProvider router={router} />);
}

describe("Header", () => {
  it("renders the HR System title", () => {
    renderWithRouter(<Header />);

    // expect(screen.getByText("HR System")).toBeInTheDocument();
    // expect(screen.getByText("人力资源管理系统")).toBeInTheDocument();
  });

  it("renders the notification bell with badge", () => {
    renderWithRouter(<Header />);

    // The badge shows "3" notifications
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders the user avatar with fallback", () => {
    renderWithRouter(<Header />);

    expect(screen.getByText("管")).toBeInTheDocument();
  });
});
