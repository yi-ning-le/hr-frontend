import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Views } from "react-big-calendar";
import { describe, expect, it, vi } from "vitest";
import { RecruiterInterviewCalendar } from "../RecruiterInterviewCalendar";

// Mock dependencies
vi.mock("@/components/interviews/EditInterviewDialog", () => ({
  EditInterviewDialog: ({ open, interview }: any) =>
    open ? <div data-testid="edit-dialog">{interview.id}</div> : null,
}));

vi.mock("@/hooks/useCandidateStatuses", () => ({
  useResolveCandidateStatus: () => ({
    resolveStatus: () => ({ name: "Screening", color: "blue" }),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderComponent = (props: any) =>
  render(
    <QueryClientProvider client={queryClient}>
      <RecruiterInterviewCalendar {...props} />
    </QueryClientProvider>,
  );

describe("RecruiterInterviewCalendar", () => {
  const mockDate = new Date("2023-10-10T10:00:00Z");
  const mockInterviews = [
    {
      id: "1",
      candidateId: "c1",
      interviewerId: "i1",
      scheduledTime: "2023-10-10T10:00:00Z",
      scheduledEndTime: "2023-10-10T11:00:00Z",
      status: "PENDING",
    },
  ];
  const mockCandidates = new Map([
    ["c1", { id: "c1", name: "Alice", appliedJobTitle: "Dev" } as any],
  ]);

  const defaultProps = {
    interviews: mockInterviews,
    candidates: mockCandidates,
    onPreviewResume: vi.fn(),
    view: Views.MONTH,
    onView: vi.fn(),
    date: mockDate,
    onNavigate: vi.fn(),
  };

  it("renders the calendar", () => {
    renderComponent(defaultProps);
    // react-big-calendar renders a toolbar with "Today", "Back", "Next" etc.
    expect(screen.getByText("recruitment.calendar.today")).toBeDefined();
    expect(screen.getByText("recruitment.calendar.month")).toBeDefined();
  });

  it("renders events", () => {
    renderComponent(defaultProps);
    // "Alice" should appear in the calendar
    expect(screen.getByText("Alice")).toBeDefined();
  });

  it("opens edit dialog when event is clicked", async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);

    // Find the event and click it
    // In react-big-calendar, the event content is rendered.
    // However, the `CustomEvent` component wraps it in a HoverCard.
    // We can try capturing the click on the text.
    await user.click(screen.getByText("Alice"));

    // The click handling might be on the event wrapper provided by RBC or our CustomEvent button?
    // In RecruiterInterviewCalendar.tsx:
    // `onSelectEvent={handleSelectEvent}` is passed to Calendar.
    // Also `CustomEvent` has an "Edit" button but it's inside HoverCardContent which is only visible on hover.
    // BUT `onSelectEvent` should trigger on clicking the event box itself in RBC.

    expect(screen.getByTestId("edit-dialog")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined(); // interview id
  });

  // Testing the HoverCard content might be tricky in RBC as it's inside the event component.
  // We can try to hover if we can find the element.
});
