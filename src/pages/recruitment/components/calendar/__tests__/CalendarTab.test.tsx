import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useInterviews } from "@/hooks/queries/useInterviews";
import { CalendarTab } from "../CalendarTab";

// Mock dependencies
vi.mock("@/hooks/queries/useInterviews");
vi.mock("@/components/candidates/ResumePreviewModal", () => ({
  ResumePreviewModal: ({ open, candidate }: any) =>
    open ? (
      <div data-testid="resume-preview-modal">{candidate?.name}</div>
    ) : null,
}));

// Mock child components to simplify testing
vi.mock("../RecruiterInterviewList", () => ({
  RecruiterInterviewList: ({ interviews, emptyTitle }: any) => (
    <div data-testid="interview-list">
      {emptyTitle} - {interviews.length} items
    </div>
  ),
}));

vi.mock("../RecruiterInterviewCalendar", () => ({
  RecruiterInterviewCalendar: ({ view, date }: any) => (
    <div data-testid="interview-calendar">
      Calendar View: {view} - {date.toString()}
    </div>
  ),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <CalendarTab />
    </QueryClientProvider>,
  );

describe("CalendarTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useInterviews as any).mockReturnValue({
      data: { interviews: [] },
      isLoading: false,
    });
  });

  it("renders the title", () => {
    renderComponent();
    expect(screen.getByText("recruitment.calendar.title")).toBeDefined();
  });

  it("shows loading skeleton when loading", () => {
    (useInterviews as any).mockReturnValue({ isLoading: true });
    renderComponent();
    // Title is always visible now
    expect(screen.getByText("recruitment.calendar.title")).toBeDefined();
    // Check for skeletons instead (we used 2 large skeletons in list view)
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders tabs for upcoming and history", () => {
    renderComponent();
    expect(
      screen.getByText("recruitment.interviews.tabs.upcoming"),
    ).toBeDefined();
    expect(
      screen.getByText("recruitment.interviews.tabs.history"),
    ).toBeDefined();
  });

  it("switches views between list and calendar", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Default is list view
    expect(screen.getByTestId("interview-list")).toBeDefined();
    expect(screen.queryByTestId("interview-calendar")).toBeNull();

    // Click calendar view button
    await user.click(screen.getByText("recruitment.interviews.calendarView"));
    expect(screen.getByTestId("interview-calendar")).toBeDefined();
    expect(screen.queryByTestId("interview-list")).toBeNull();

    // Click list view button
    await user.click(screen.getByText("recruitment.interviews.listView"));
    expect(screen.getByTestId("interview-list")).toBeDefined();
  });

  it("correctly separates upcoming and history interviews", async () => {
    const user = userEvent.setup();
    const today = new Date();
    const futureDate = new Date(today.getTime() + 86400000);
    const pastDate = new Date(today.getTime() - 86400000);

    const mockInterviews = [
      { id: "1", status: "PENDING", scheduledTime: futureDate.toISOString() },
      { id: "2", status: "COMPLETED", scheduledTime: pastDate.toISOString() },
    ];

    // Smarter mock that filters based on params
    (useInterviews as any).mockImplementation((params: any) => {
      if (!params || !params.status)
        return {
          data: { interviews: mockInterviews, total: 2 },
          isLoading: false,
        };

      const filtered = mockInterviews.filter((i) =>
        params.status.includes(i.status),
      );
      return {
        data: {
          interviews: filtered,
          total: filtered.length,
        },
        isLoading: false,
      };
    });

    renderComponent();

    // Check Upcoming tab content (default) - should only see PENDING
    expect(
      screen.getByText(/recruitment.interviews.noUpcomingInterviews - 1 items/),
    ).toBeDefined();

    // Switch to History tab
    await user.click(screen.getByText("recruitment.interviews.tabs.history"));

    // Use waitFor to handle potential async tab switching
    await waitFor(() => {
      const historyList = screen.getByTestId("interview-list");
      expect(historyList.textContent).toContain(
        "recruitment.interviews.noHistoryInterviews",
      );
      expect(historyList.textContent).toContain("1 items");
    });
  });
});
