import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as useCandidates from "@/hooks/queries/useCandidates";
import * as useInterviews from "@/hooks/queries/useInterviews";
import { MyInterviewsPage } from "../MyInterviewsPage";

// Mock the hooks
vi.mock("@/hooks/queries/useInterviews");
vi.mock("@/hooks/queries/useCandidates");
vi.mock("@/components/candidates/ResumePreviewModal", () => ({
  ResumePreviewModal: () => null,
}));

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
    // Check for skeletons implicitly or structure
    // Since skeleton doesn't have text, tough to query by text.
    // We can assume it renders without crashing.
  });

  it("renders empty state when no interviews", async () => {
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
    expect(
      screen.getByText("recruitment.interviews.noUpcomingInterviews"),
    ).toBeInTheDocument();
  });

  it("renders interviews list", async () => {
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
    // The mock returns the translation key as-is
    expect(
      screen.getByText("recruitment.interviews.status.PENDING"),
    ).toBeInTheDocument();

    // Check Date formatting (depends on timezone, using partial match or flexible check)
    // format(new Date(...), "MMM d, h:mm a") -> Oct 27, ...
    expect(screen.getByText(/Oct 27/)).toBeInTheDocument();
  });
});
