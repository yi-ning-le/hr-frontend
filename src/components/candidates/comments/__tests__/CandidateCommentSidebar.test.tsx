import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { CandidateCommentSidebar } from "../CandidateCommentSidebar";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: { language: "en" },
  }),
}));

vi.mock("date-fns", () => ({
  formatDistanceToNow: vi.fn(() => "1 day ago"),
}));

vi.mock("date-fns/locale", () => ({
  enUS: {},
  zhCN: {},
}));

const mockMutateAsync = vi.fn();

vi.mock("@/hooks/queries/useCandidateComments", () => ({
  useCandidateComments: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useAddCandidateComment: vi.fn(() => ({
    mutateAsync: mockMutateAsync,
  })),
}));

// Must import after mock setup
const { useCandidateComments } = await import(
  "@/hooks/queries/useCandidateComments"
);

const mockCandidate: Candidate = {
  id: "cand1",
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "555-0100",
  experienceYears: 5,
  education: "Bachelor",
  appliedJobId: "job1",
  appliedJobTitle: "Engineer",
  channel: "LinkedIn",
  resumeUrl: "https://example.com/resume.pdf",
  status: "NEW",
  appliedAt: new Date("2025-01-01"),
};

const commentsData = [
  {
    id: "c1",
    candidateId: "cand1",
    authorId: "a1",
    authorName: "Alice",
    authorRole: "HR" as const,
    content: "Good candidate",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "c2",
    candidateId: "cand1",
    authorId: "a2",
    authorName: "Bob",
    authorRole: "INTERVIEWER" as const,
    content: "Strong skills",
    createdAt: "2025-01-15T11:00:00Z",
  },
];

describe("CandidateCommentSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCandidateComments).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);
  });

  it("renders sidebar header with title", () => {
    render(<CandidateCommentSidebar candidate={mockCandidate} />);

    expect(
      screen.getByText("recruitment.candidates.comments.title"),
    ).toBeInTheDocument();
  });

  it("shows comment count badge when comments exist", () => {
    vi.mocked(useCandidateComments).mockReturnValue({
      data: commentsData,
      isLoading: false,
    } as any);

    render(<CandidateCommentSidebar candidate={mockCandidate} />);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("hides comment count badge when no comments", () => {
    render(<CandidateCommentSidebar candidate={mockCandidate} />);

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("renders close button when onClose is provided", () => {
    const onClose = vi.fn();
    render(
      <CandidateCommentSidebar candidate={mockCandidate} onClose={onClose} />,
    );

    // The close button is a ghost icon button with an X icon
    const buttons = screen.getAllByRole("button");
    // One is the submit button from CommentInput, the other is close
    const closeButton = buttons.find(
      (btn) =>
        !btn.textContent?.includes("recruitment.candidates.comments.submit"),
    );
    expect(closeButton).toBeInTheDocument();
  });

  it("does not render close button when onClose is not provided", () => {
    render(<CandidateCommentSidebar candidate={mockCandidate} />);

    // Only the submit button from CommentInput should be present
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <CandidateCommentSidebar candidate={mockCandidate} onClose={onClose} />,
    );

    const buttons = screen.getAllByRole("button");
    const closeButton = buttons.find(
      (btn) =>
        !btn.textContent?.includes("recruitment.candidates.comments.submit"),
    );
    await user.click(closeButton!);

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("passes handleAddComment to CommentInput", () => {
    render(<CandidateCommentSidebar candidate={mockCandidate} />);

    // CommentInput should be rendered with a textarea
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
