import { fireEvent, render, screen } from "@testing-library/react";
import { addMonths, format, subMonths } from "date-fns";
import { describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import type { Interview } from "@/types/recruitment";
import { InterviewCalendar } from "../InterviewCalendar";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: { language: "en-US" },
  }),
}));

// Mock useNavigate
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

describe("InterviewCalendar", () => {
  const mockCandidates = new Map<string, Candidate>();
  mockCandidates.set("c1", {
    id: "c1",
    name: "Alice",
    appliedJobTitle: "Developer",
  } as Candidate);

  const today = new Date();
  const mockInterviews: Interview[] = [
    {
      id: "i1",
      candidateId: "c1",
      interviewerId: "int1",
      jobId: "j1",
      scheduledTime: today.toISOString(),
      scheduledEndTime: new Date(
        today.getTime() + 60 * 60 * 1000,
      ).toISOString(),
      status: "PENDING",
      createdAt: "",
    },
  ];

  it("renders the current month by default", () => {
    render(
      <InterviewCalendar
        interviews={[]}
        candidates={mockCandidates}
        onPreviewResume={vi.fn()}
      />,
    );
    // react-big-calendar renders the month title in the toolbar
    expect(screen.getByText(format(today, "MMMM yyyy"))).toBeInTheDocument();
  });

  it("navigates to previous and next months", () => {
    render(
      <InterviewCalendar
        interviews={[]}
        candidates={mockCandidates}
        onPreviewResume={vi.fn()}
      />,
    );

    // react-big-calendar toolbar buttons
    // The mock translation returns the default value ("Back", "Next", "Today")
    const prevButton = screen.getByText("Back");
    fireEvent.click(prevButton);
    expect(
      screen.getByText(format(subMonths(today, 1), "MMMM yyyy")),
    ).toBeInTheDocument();

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton); // Back to today (approx)
    fireEvent.click(nextButton); // Next month
    expect(
      screen.getByText(format(addMonths(today, 1), "MMMM yyyy")),
    ).toBeInTheDocument();
  });

  it("renders interviews on the correct date", () => {
    render(
      <InterviewCalendar
        interviews={mockInterviews}
        candidates={mockCandidates}
        onPreviewResume={vi.fn()}
      />,
    );

    // Look for Alice's name in the event
    expect(screen.getByText("Alice")).toBeInTheDocument();
    // Look for interview time in the event
    expect(screen.getByText(format(today, "HH:mm"))).toBeInTheDocument();
  });
});
