// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { CandidateCard } from "../CandidateCard";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { years?: number; date?: string }) => {
      if (key === "recruitment.candidates.card.yearsExp")
        return `${options?.years} years`;
      if (key === "recruitment.candidates.card.appliedOn")
        return `Applied on ${options?.date}`;
      return key;
    },
  }),
}));

vi.mock("@/hooks/useCandidateStatuses", () => ({
  useCandidateStatuses: () => ({
    statuses: [
      { id: "1", slug: "new", name: "New", type: "system", color: "#000000" },
    ],
    statusMap: {
      new: {
        id: "1",
        slug: "new",
        name: "New",
        type: "system",
        color: "#000000",
      },
    },
  }),
}));

describe("CandidateCard", () => {
  const mockCandidate: Candidate = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    appliedJobId: "job-1",
    appliedJobTitle: "Frontend Engineer",
    status: "new",
    appliedAt: new Date("2024-01-01"),
    resumeUrl: "http://example.com/resume.pdf",
    experienceYears: 5,
    avatar: "http://example.com/avatar.jpg",
    phone: "1234567890",
    education: "BS CS",
    channel: "LinkedIn",
    note: "Candidate note",
  };

  const defaultProps = {
    candidate: mockCandidate,
    onClick: vi.fn(),
  };

  it("renders candidate information correctly", () => {
    render(<CandidateCard {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("5 years")).toBeInTheDocument();
    expect(screen.getByText(/Applied on/)).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    render(<CandidateCard {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /John Doe/i }));

    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it("renders StatusBadge", () => {
    render(<CandidateCard {...defaultProps} />);

    // Status text (mocked translation key)
    expect(
      screen.getByText(/recruitment.candidates.statusOptions/),
    ).toBeInTheDocument();
  });
});
