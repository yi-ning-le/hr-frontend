import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CandidateCommentsSection } from "../CandidateCommentsSection";

// Mock hooks
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

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

// Mock date-fns to avoid time zone issues if used in child components
vi.mock("date-fns", () => ({
  formatDistanceToNow: vi.fn(() => "1 day ago"),
}));

vi.mock("date-fns/locale", () => ({
  enUS: {},
  zhCN: {},
}));

// Import after mock setup
const { useCandidateComments } = await import(
  "@/hooks/queries/useCandidateComments"
);

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
];

describe("CandidateCommentsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCandidateComments).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);
  });

  it("renders without crashing", () => {
    render(<CandidateCommentsSection candidateId="cand1" />);
    // Check for textarea
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders comments when data is available", () => {
    vi.mocked(useCandidateComments).mockReturnValue({
      data: commentsData,
      isLoading: false,
    } as any);

    render(<CandidateCommentsSection candidateId="cand1" />);
    expect(screen.getByText("Good candidate")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("calls addComment when submitting a comment", async () => {
    const user = userEvent.setup();
    render(<CandidateCommentsSection candidateId="cand1" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "New comment");

    const submitBtn = screen.getByRole("button", {
      name: /recruitment.candidates.comments.submit/i,
    });
    await user.click(submitBtn);

    expect(mockMutateAsync).toHaveBeenCalledWith({
      candidateId: "cand1",
      content: "New comment",
    });
  });

  it("renders optional header", () => {
    render(
      <CandidateCommentsSection
        candidateId="cand1"
        header={<h1 data-testid="custom-header">Custom Header</h1>}
      />,
    );
    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    expect(screen.getByText("Custom Header")).toBeInTheDocument();
  });
});
