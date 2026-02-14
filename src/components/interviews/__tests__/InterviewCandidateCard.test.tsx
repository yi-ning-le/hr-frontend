import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { InterviewCandidateCard } from "../InterviewCandidateCard";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

describe("InterviewCandidateCard", () => {
  const mockCandidate: Candidate = {
    id: "c1",
    name: "Alice",
    appliedJobTitle: "Developer",
    email: "alice@example.com",
    phone: "1234567890",
    resumeUrl: "http://example.com/resume.pdf",
    status: "interviewing",
    appliedAt: new Date(),
    experienceYears: 5,
    education: "Bachelor",
    appliedJobId: "j1",
    channel: "LinkedIn",
  };

  it("renders candidate info", () => {
    render(
      <InterviewCandidateCard
        candidate={mockCandidate}
        statusDef={{ name: "Interviewing", color: "blue" }}
        onPreviewResume={vi.fn()}
      />,
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Interviewing")).toBeInTheDocument();
  });

  it("renders unknown when candidate is missing", () => {
    render(
      <InterviewCandidateCard
        candidate={undefined}
        statusDef={null}
        onPreviewResume={vi.fn()}
      />,
    );

    expect(screen.getByText("common.unknown")).toBeInTheDocument();
  });

  it("calls onPreviewResume when clicking view resume", () => {
    const onPreviewResume = vi.fn();
    render(
      <InterviewCandidateCard
        candidate={mockCandidate}
        statusDef={null}
        onPreviewResume={onPreviewResume}
      />,
    );

    fireEvent.click(screen.getByText("View Resume"));
    expect(onPreviewResume).toHaveBeenCalled();
  });

  it("does not render resume button if no url", () => {
    const candidateNoResume = { ...mockCandidate, resumeUrl: "" };
    render(
      <InterviewCandidateCard
        candidate={candidateNoResume}
        statusDef={null}
        onPreviewResume={vi.fn()}
      />,
    );

    expect(screen.queryByText("View Resume")).not.toBeInTheDocument();
  });
});
