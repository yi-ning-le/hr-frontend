import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { describe, expect, it, vi } from "vitest";
import type { Interview } from "@/types/recruitment.d";
import { InterviewScheduleCard } from "../InterviewScheduleCard";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

describe("InterviewScheduleCard", () => {
  const today = new Date();
  const mockInterview: Interview = {
    id: "i1",
    candidateId: "c1",
    jobId: "j1",
    interviewerId: "int1",
    scheduledTime: today.toISOString(),
    scheduledEndTime: new Date(today.getTime() + 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  it("renders schedule info", () => {
    render(<InterviewScheduleCard interview={mockInterview} />);

    // Date
    expect(
      screen.getByText(format(today, "EEEE, MMMM d, yyyy")),
    ).toBeInTheDocument();

    // Time
    const startTime = format(today, "h:mm a");
    // Depending on how the time is formatted in the component (start - end or just start)
    // The component does: `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`

    // We can just check for partial match if exact string is tricky due to whitespace
    expect(
      screen.getByText((content) => content.includes(startTime)),
    ).toBeInTheDocument();
  });
});
