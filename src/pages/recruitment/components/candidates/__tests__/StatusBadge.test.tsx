import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatusBadge } from "../StatusBadge";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

describe("StatusBadge", () => {
  it("renders 'new' status correctly", () => {
    render(<StatusBadge status="new" />);
    expect(screen.getByText("recruitment.candidates.statusOptions.new")).toBeInTheDocument();
  });

  it("renders 'screening' status correctly", () => {
    render(<StatusBadge status="screening" />);
    expect(screen.getByText("recruitment.candidates.statusOptions.screening")).toBeInTheDocument();
  });

  it("renders 'interview' status correctly", () => {
    render(<StatusBadge status="interview" />);
    expect(screen.getByText("recruitment.candidates.statusOptions.interview")).toBeInTheDocument();
  });

  it("renders 'offer' status correctly", () => {
    render(<StatusBadge status="offer" />);
    expect(screen.getByText("recruitment.candidates.statusOptions.offer")).toBeInTheDocument();
  });

  it("renders 'hired' status correctly", () => {
    render(<StatusBadge status="hired" />);
    expect(screen.getByText("recruitment.candidates.statusOptions.hired")).toBeInTheDocument();
  });

  it("renders 'rejected' status correctly", () => {
    render(<StatusBadge status="rejected" />);
    expect(screen.getByText("recruitment.candidates.statusOptions.rejected")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<StatusBadge status="new" className="custom-class" />);

    // Check if the badge (which usually is a div or span) has the class
    const badge = screen.getByText("recruitment.candidates.statusOptions.new").closest(".inline-flex");
    expect(badge).toHaveClass("custom-class");
  });
});
