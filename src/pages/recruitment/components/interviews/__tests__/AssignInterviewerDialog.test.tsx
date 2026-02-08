// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { AssignInterviewerDialog } from "../AssignInterviewerDialog";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock hooks
vi.mock("@/hooks/queries/useEmployees", () => ({
  useEmployees: () => ({
    data: { employees: [] },
  }),
}));

vi.mock("@/hooks/queries/useInterviews", () => ({
  useCreateInterview: () => ({
    mutateAsync: vi.fn(),
  }),
}));

// Mock components
vi.mock("@/components/ui/calendar", () => ({
  Calendar: () => <div data-testid="calendar" />,
}));

// Mock ResizeObserver
beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof globalThis.ResizeObserver;
});

const mockCandidate: Candidate = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  experienceYears: 5,
  education: "Bachelor",
  appliedJobId: "job1",
  appliedJobTitle: "Frontend Developer",
  channel: "LinkedIn",
  resumeUrl: "resume.pdf",
  status: "new",
  appliedAt: new Date("2024-01-01"),
  note: "Good candidate",
};

describe("AssignInterviewerDialog", () => {
  it("renders translated labels and titles", () => {
    render(
      <AssignInterviewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("recruitment.interviews.assignTitle"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.interviews.interviewer"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.interviews.scheduledTime"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.interviews.initialNotes"),
    ).toBeInTheDocument();
    expect(screen.getByText("common.assign")).toBeInTheDocument();
  });
});
