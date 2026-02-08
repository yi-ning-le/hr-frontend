import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "@/components/layout/Footer";

// Mock LanguageSwitcher component
vi.mock("@/components/layout/LanguageSwitcher", () => ({
  LanguageSwitcher: () => (
    <div data-testid="language-switcher">Language Switcher</div>
  ),
}));

describe("Footer", () => {
  it("renders the copyright text", () => {
    render(<Footer />);

    expect(screen.getByText("footer.copyright")).toBeInTheDocument();
  });

  it("renders the LanguageSwitcher", () => {
    render(<Footer />);

    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });
});
