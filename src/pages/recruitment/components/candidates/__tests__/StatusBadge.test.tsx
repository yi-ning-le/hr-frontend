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

vi.mock("@/hooks/useCandidateStatuses", () => ({
  useCandidateStatuses: () => ({
    statuses: [
      { id: "1", slug: "new", name: "New", type: "system", color: "#000000" },
      {
        id: "2",
        slug: "screening",
        name: "Screening",
        type: "system",
        color: "#000000",
      },
      {
        id: "3",
        slug: "interview",
        name: "Interview",
        type: "system",
        color: "#000000",
      },
      {
        id: "4",
        slug: "offer",
        name: "Offer",
        type: "system",
        color: "#000000",
      },
      {
        id: "5",
        slug: "hired",
        name: "Hired",
        type: "system",
        color: "#000000",
      },
      {
        id: "6",
        slug: "rejected",
        name: "Rejected",
        type: "system",
        color: "#000000",
      },
    ],
    statusMap: {
      new: {
        id: "1",
        slug: "new",
        name: "New",
        type: "system",
        color: "#000000",
      },
      screening: {
        id: "2",
        slug: "screening",
        name: "Screening",
        type: "system",
        color: "#000000",
      },
      interview: {
        id: "3",
        slug: "interview",
        name: "Interview",
        type: "system",
        color: "#000000",
      },
      offer: {
        id: "4",
        slug: "offer",
        name: "Offer",
        type: "system",
        color: "#000000",
      },
      hired: {
        id: "5",
        slug: "hired",
        name: "Hired",
        type: "system",
        color: "#000000",
      },
      rejected: {
        id: "6",
        slug: "rejected",
        name: "Rejected",
        type: "system",
        color: "#000000",
      },
    },
  }),
}));

describe("StatusBadge", () => {
  it("renders 'new' status correctly", () => {
    render(<StatusBadge status="new" />);
    expect(
      screen.getByText("recruitment.candidates.statusOptions.new"),
    ).toBeInTheDocument();
  });

  it("renders 'screening' status correctly", () => {
    render(<StatusBadge status="screening" />);
    expect(
      screen.getByText("recruitment.candidates.statusOptions.screening"),
    ).toBeInTheDocument();
  });

  it("renders 'interview' status correctly", () => {
    render(<StatusBadge status="interview" />);
    expect(
      screen.getByText("recruitment.candidates.statusOptions.interview"),
    ).toBeInTheDocument();
  });

  it("renders 'offer' status correctly", () => {
    render(<StatusBadge status="offer" />);
    expect(
      screen.getByText("recruitment.candidates.statusOptions.offer"),
    ).toBeInTheDocument();
  });

  it("renders 'hired' status correctly", () => {
    render(<StatusBadge status="hired" />);
    expect(
      screen.getByText("recruitment.candidates.statusOptions.hired"),
    ).toBeInTheDocument();
  });

  it("renders 'rejected' status correctly", () => {
    render(<StatusBadge status="rejected" />);
    expect(
      screen.getByText("recruitment.candidates.statusOptions.rejected"),
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<StatusBadge status="new" className="custom-class" />);

    // Check if the badge (which usually is a div or span) has the class
    const badge = screen
      .getByText("recruitment.candidates.statusOptions.new")
      .closest(".inline-flex");
    expect(badge).toHaveClass("custom-class");
  });
});
