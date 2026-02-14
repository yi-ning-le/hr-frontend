import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import type { Interview } from "@/types/recruitment.d";
import { InterviewList } from "../InterviewList";

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

describe("InterviewList", () => {
  const mockCandidates = new Map<string, Candidate>();
  const candidate: Candidate = {
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
  mockCandidates.set("c1", candidate);

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

  it("renders empty state when no interviews", () => {
    render(
      <InterviewList
        interviews={[]}
        candidatesById={mockCandidates}
        onPreviewResume={vi.fn()}
        emptyTitle="No Interviews"
        emptyDesc="No interviews scheduled"
      />,
    );

    expect(screen.getByText("No Interviews")).toBeInTheDocument();
    expect(screen.getByText("No interviews scheduled")).toBeInTheDocument();
  });

  it("renders list of interviews", () => {
    render(
      <InterviewList
        interviews={[mockInterview]}
        candidatesById={mockCandidates}
        onPreviewResume={vi.fn()}
        emptyTitle="No Interviews"
        emptyDesc="No interviews scheduled"
      />,
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });
});
