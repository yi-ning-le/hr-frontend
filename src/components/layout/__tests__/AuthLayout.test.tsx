import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthLayout } from "../AuthLayout";

// Mock TanStack Router's Outlet component
vi.mock("@tanstack/react-router", () => ({
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

// Mock LanguageSwitcher component
vi.mock("../LanguageSwitcher", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

describe("AuthLayout", () => {
  it("renders the layout container", () => {
    render(<AuthLayout />);

    // Check for the outlet content
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.getByText("Outlet Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<AuthLayout className="custom-class" />);

    const layoutDiv = container.firstChild as HTMLElement;
    expect(layoutDiv).toHaveClass("custom-class");
  });

  it("has proper styling classes", () => {
    const { container } = render(<AuthLayout />);

    const layoutDiv = container.firstChild as HTMLElement;
    expect(layoutDiv).toHaveClass("min-h-screen");
  });

  it("centers content properly", () => {
    render(<AuthLayout />);

    // The outlet should be rendered within the centered container
    const outlet = screen.getByTestId("outlet");
    expect(outlet.closest(".justify-center")).toBeInTheDocument();
  });

  it("renders the LanguageSwitcher at the bottom", () => {
    render(<AuthLayout />);

    // Verify LanguageSwitcher is rendered
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });
});
