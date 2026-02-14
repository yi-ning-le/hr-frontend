import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import type { Interview } from "@/types/recruitment";
import { InterviewCard } from "../InterviewCard";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

// Mock Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

// Mock useResolveCandidateStatus
vi.mock("@/hooks/useCandidateStatuses", () => ({
  useResolveCandidateStatus: () => ({
    resolveStatus: () => ({ name: "Interviewing", color: "#blue" }),
  }),
}));

describe("InterviewCard", () => {
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

  const mockInterview: Interview = {
    id: "i1",
    candidateId: "c1",
    jobId: "j1",
    interviewerId: "int1",
    scheduledTime: new Date("2023-10-10T10:00:00Z").toISOString(),
    scheduledEndTime: new Date("2023-10-10T11:00:00Z").toISOString(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  it("renders candidate name and job title", () => {
    render(
      <InterviewCard
        interview={mockInterview}
        candidate={mockCandidate}
        onPreviewResume={vi.fn()}
      />,
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("renders interview time", () => {
    render(
      <InterviewCard
        interview={mockInterview}
        candidate={mockCandidate}
        onPreviewResume={vi.fn()}
      />,
    );

    // Depending on timezone, exact time string might vary, but let's check for formatted parts
    // "d" format for date
    expect(screen.getByText("10")).toBeInTheDocument();
    // "MMM" format
    expect(screen.getByText("Oct")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(
      <InterviewCard
        interview={mockInterview}
        candidate={mockCandidate}
        onPreviewResume={vi.fn()}
      />,
    );

    expect(screen.getByText("Interviewing")).toBeInTheDocument();
  });

  it("renders unknown candidate when candidate is missing", () => {
    render(
      <InterviewCard
        interview={mockInterview}
        candidate={undefined}
        onPreviewResume={vi.fn()}
      />,
    );

    expect(screen.getByText("Unknown Candidate")).toBeInTheDocument();
  });
});
