
// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CandidateCard } from "../CandidateCard";
import type { Candidate } from "@/types/candidate";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { years?: number; date?: string }) => {
      if (key === "recruitment.candidates.card.yearsExp") return `${options?.years} years`;
      if (key === "recruitment.candidates.card.appliedOn") return `Applied on ${options?.date}`;
      return key;
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
    note: "Candidate note"
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

    fireEvent.click(screen.getByText("John Doe").closest("div[class*='cursor-pointer']")!);

    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it("renders StatusBadge", () => {
    render(<CandidateCard {...defaultProps} />);

    // Status text (mocked translation key)
    expect(screen.getByText(/recruitment.candidates.statusOptions/)).toBeInTheDocument();
  });
});
