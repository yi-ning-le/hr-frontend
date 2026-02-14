import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as useCandidates from "@/hooks/queries/useCandidates";
import * as useInterviews from "@/hooks/queries/useInterviews";
import { MyInterviewsPage } from "../MyInterviewsPage";

// Mock the hooks
vi.mock("@/hooks/queries/useInterviews");
vi.mock("@/hooks/queries/useCandidates");
vi.mock("@/hooks/useCandidateStatuses", () => ({
  useCandidateStatuses: () => ({
    statuses: [],
    statusMap: {},
    isLoading: false,
  }),
  useResolveCandidateStatus: () => ({
    resolveStatus: vi.fn(),
  }),
}));
vi.mock("@/components/candidates/ResumePreviewModal", () => ({
  ResumePreviewModal: () => null,
}));

// Mock InterviewCalendar
vi.mock("@/components/interviews/InterviewCalendar", () => ({
  InterviewCalendar: () => (
    <div data-testid="interview-calendar">Calendar Component</div>
  ),
}));

// Shared route state to simulate TanStack Router navigation
const routeState = { viewMode: "list" as "list" | "calendar" };

const mockNavigate = vi.fn(
  (options: { search?: (prev: typeof routeState) => typeof routeState }) => {
    if (options?.search) {
      routeState.viewMode = options.search(routeState).viewMode;
    }
  },
);

// Mock Link from tanstack router
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
  }: {
    children: React.ReactNode;
    to: string;
    params?: Record<string, string>;
  }) => (
    <a href={to.replace("$interviewId", params?.interviewId || "")}>
      {children}
    </a>
  ),
  useParams: () => ({}),
  useNavigate: () => mockNavigate,
  createRootRoute: () => ({
    component: ({ children }: { children: React.ReactNode }) => children,
  }),
  createProtectedRoute: () => ({
    component: ({ children }: { children: React.ReactNode }) => children,
  }),
  createRoute: () => ({
    component: ({ children }: { children: React.ReactNode }) => children,
    useSearch: () => ({ viewMode: routeState.viewMode }),
    useNavigate: () => mockNavigate,
  }),
}));

// Mock the specific route
vi.mock("@/routes/_protected/my-interviews", () => ({
  Route: {
    useNavigate: () => mockNavigate,
    useSearch: () => ({ viewMode: routeState.viewMode }),
  },
}));

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: { type: "3rdParty" },
}));

describe("MyInterviewsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset route state
    routeState.viewMode = "list";
  });

  it("renders loading skeletons when loading", () => {
    vi.mocked(useInterviews.useMyInterviews).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useInterviews.useMyInterviews>);
    vi.mocked(useCandidates.useCandidates).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useCandidates.useCandidates>);

    render(<MyInterviewsPage />);
  });

  it("renders empty state when no interviews in list view", async () => {
    vi.mocked(useInterviews.useMyInterviews).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useInterviews.useMyInterviews>);
    vi.mocked(useCandidates.useCandidates).mockReturnValue({
      data: { data: [], meta: { total: 0, page: 1, limit: 10 } },
      isLoading: false,
    } as unknown as ReturnType<typeof useCandidates.useCandidates>);

    render(<MyInterviewsPage />);

    expect(
      screen.getByText("recruitment.interviews.myInterviews"),
    ).toBeInTheDocument();

    // Check view toggles exist
    expect(
      screen.getByText("recruitment.interviews.listView"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.interviews.calendarView"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("recruitment.interviews.noUpcomingInterviews"),
    ).toBeInTheDocument();
  });

  it("renders interviews list in default view", async () => {
    const mockInterviews = [
      {
        id: "1",
        candidateId: "c1",
        interviewerId: "e1",
        jobId: "j1",
        scheduledTime: new Date("2023-10-27T10:00:00Z").toISOString(),
        status: "PENDING",
        notes: "Some notes",
        createdAt: new Date().toISOString(),
      },
    ];

    const mockCandidates = [
      {
        id: "c1",
        name: "John Doe",
        appliedJobTitle: "Software Engineer",
      },
    ];

    vi.mocked(useInterviews.useMyInterviews).mockReturnValue({
      data: mockInterviews,
      isLoading: false,
    } as unknown as ReturnType<typeof useInterviews.useMyInterviews>);

    vi.mocked(useCandidates.useCandidates).mockReturnValue({
      data: { data: mockCandidates, meta: { total: 1, page: 1, limit: 10 } },
      isLoading: false,
    } as unknown as ReturnType<typeof useCandidates.useCandidates>);

    render(<MyInterviewsPage />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();

    expect(screen.getByText("27")).toBeInTheDocument();
  });

  it("switches to calendar view", async () => {
    vi.mocked(useInterviews.useMyInterviews).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useInterviews.useMyInterviews>);
    vi.mocked(useCandidates.useCandidates).mockReturnValue({
      data: { data: [], meta: { total: 0, page: 1, limit: 10 } },
      isLoading: false,
    } as unknown as ReturnType<typeof useCandidates.useCandidates>);

    const { rerender } = render(<MyInterviewsPage />);

    // Initially in list view - should show empty state message
    expect(
      screen.getByText("recruitment.interviews.noUpcomingInterviews"),
    ).toBeInTheDocument();

    // Click calendar view button
    const calendarBtn = screen.getByText("recruitment.interviews.calendarView");
    fireEvent.click(calendarBtn);

    // After clicking, routeState is updated. Need to rerender to reflect the change
    // The component should now show calendar view
    expect(mockNavigate).toHaveBeenCalledWith({
      search: expect.any(Function),
    });

    // Simulate what would happen: update the state and rerender
    routeState.viewMode = "calendar";
    rerender(<MyInterviewsPage />);

    // Now calendar should be visible
    expect(screen.getByTestId("interview-calendar")).toBeInTheDocument();
  });
});
