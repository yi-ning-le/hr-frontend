import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as useCandidates from "@/hooks/queries/useCandidates";
import * as useInterviews from "@/hooks/queries/useInterviews";
import { InterviewDetailPage } from "../InterviewDetailPage";

// Mock hooks
vi.mock("@/hooks/queries/useInterviews");
vi.mock("@/hooks/queries/useCandidates");
vi.mock("@/components/candidates/ResumePreviewModal", () => ({
  ResumePreviewModal: () => null,
}));
vi.mock("@/components/candidates/comments/CandidateCommentsSection", () => ({
  CandidateCommentsSection: ({ candidateId }: { candidateId: string }) => (
    <div data-testid="comments-section">Comments for {candidateId}</div>
  ),
}));

let currentInterviewId = "1";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useParams: () => ({ interviewId: currentInterviewId }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: { type: "3rdParty" },
}));

describe("InterviewDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentInterviewId = "1";
  });

  const mockInterview = {
    id: "1",
    candidateId: "c1",
    interviewerId: "e1",
    jobId: "j1",
    scheduledTime: new Date("2023-10-27T10:00:00Z").toISOString(),
    status: "PENDING",
    notes: "Initial notes",
    createdAt: new Date().toISOString(),
  };

  const mockCandidate = {
    id: "c1",
    name: "John Doe",
    appliedJobTitle: "Software Engineer",
    email: "john@example.com",
    phone: "123-456-7890",
  };

  it("renders interview details and comments section", () => {
    vi.mocked(useInterviews.useInterview).mockReturnValue({
      data: mockInterview,
      isLoading: false,
    } as unknown as ReturnType<typeof useInterviews.useInterview>);

    vi.mocked(useCandidates.useCandidate).mockReturnValue({
      data: mockCandidate,
      isLoading: false,
    } as unknown as ReturnType<typeof useCandidates.useCandidate>);

    render(<InterviewDetailPage />);

    expect(
      screen.getByText("recruitment.interviews.interviewDetails"),
    ).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();

    // Should NOT show legacy notes anymore
    expect(
      screen.queryByText("recruitment.interviews.initialNotes"),
    ).not.toBeInTheDocument();

    // Check for comments section
    expect(screen.getByTestId("comments-section")).toHaveTextContent(
      "Comments for c1",
    );
  });
});
