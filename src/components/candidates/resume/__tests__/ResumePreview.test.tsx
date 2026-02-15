// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResumePreview } from "@/components/candidates/resume/ResumePreview";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

describe("ResumePreview", () => {
  const mockOnClick = vi.fn();

  const renderComponent = () => {
    return render(<ResumePreview onClick={mockOnClick} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct accessibility attributes", () => {
    renderComponent();

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("cursor-pointer");
  });

  it("renders FileText icon", () => {
    renderComponent();

    const icon = document.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("text-primary");
  });

  it("displays view resume title", () => {
    renderComponent();

    expect(
      screen.getByText("recruitment.candidates.detail.viewResume"),
    ).toBeInTheDocument();
  });

  it("displays click to preview hint", () => {
    renderComponent();

    expect(
      screen.getByText("recruitment.candidates.detail.clickToPreview"),
    ).toBeInTheDocument();
  });

  it("calls onClick when button is clicked", () => {
    renderComponent();

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("has hover and focus styles", () => {
    renderComponent();

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:ring-2", "hover:ring-primary/50");
    expect(button).toHaveClass(
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-primary",
    );
  });

  it("renders container with correct layout", () => {
    renderComponent();

    const container = screen
      .getByText("recruitment.candidates.detail.viewResume")
      .closest("div");
    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "h-48",
      "rounded-xl",
      "border",
    );
  });
});
