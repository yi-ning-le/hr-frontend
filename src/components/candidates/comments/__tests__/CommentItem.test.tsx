import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CandidateComment } from "@/types/candidate";
import { CommentItem } from "../CommentItem";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: { language: "en" },
  }),
}));

vi.mock("date-fns", () => ({
  formatDistanceToNow: vi.fn(() => "3 hours ago"),
}));

vi.mock("date-fns/locale", () => ({
  enUS: {},
  zhCN: {},
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, ...props }: any) => (
    <span data-slot="avatar" {...props}>
      {children}
    </span>
  ),
  AvatarImage: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} data-slot="avatar-image" {...props} />
  ),
  AvatarFallback: ({ children, ...props }: any) => (
    <span data-slot="avatar-fallback" {...props}>
      {children}
    </span>
  ),
}));

const makeComment = (
  overrides: Partial<CandidateComment> = {},
): CandidateComment => ({
  id: "c1",
  candidateId: "cand1",
  authorId: "auth1",
  authorName: "John Doe",
  authorRole: "HR",
  content: "This candidate looks great.",
  createdAt: "2025-01-15T10:00:00Z",
  ...overrides,
});

describe("CommentItem", () => {
  it("renders author name and comment content", () => {
    render(<CommentItem comment={makeComment()} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("This candidate looks great.")).toBeInTheDocument();
  });

  it("computes initials correctly for two-word names", () => {
    render(<CommentItem comment={makeComment({ authorName: "John Doe" })} />);

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("computes initials for single-word names", () => {
    render(<CommentItem comment={makeComment({ authorName: "Admin" })} />);

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it('shows default badge variant when authorRole is "HR"', () => {
    render(<CommentItem comment={makeComment({ authorRole: "HR" })} />);

    const badge = screen.getByText("recruitment.candidates.comments.hrRole");
    expect(badge).toBeInTheDocument();
  });

  it('shows secondary badge variant when authorRole is "INTERVIEWER"', () => {
    render(
      <CommentItem comment={makeComment({ authorRole: "INTERVIEWER" })} />,
    );

    const badge = screen.getByText(
      "recruitment.candidates.comments.interviewerRole",
    );
    expect(badge).toBeInTheDocument();
  });

  it("renders relative time via formatDistanceToNow", () => {
    render(<CommentItem comment={makeComment()} />);

    expect(screen.getByText(/3 hours ago/)).toBeInTheDocument();
  });

  it("renders avatar image when authorAvatar is provided", () => {
    render(
      <CommentItem
        comment={makeComment({
          authorAvatar: "https://example.com/avatar.png",
        })}
      />,
    );

    const img = screen.getByRole("img", { name: "John Doe" });
    expect(img).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it('renders green suitable badge when commentType is "review_suitable"', () => {
    render(
      <CommentItem comment={makeComment({ commentType: "review_suitable" })} />,
    );

    const badge = screen.getByTestId("review-decision-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(/suitable/i);
  });

  it('renders red unsuitable badge when commentType is "review_unsuitable"', () => {
    render(
      <CommentItem
        comment={makeComment({ commentType: "review_unsuitable" })}
      />,
    );

    const badge = screen.getByTestId("review-decision-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(/unsuitable/i);
  });

  it("renders non-status content for review decision comments", () => {
    render(
      <CommentItem
        comment={makeComment({
          commentType: "review_suitable",
          content: "Detailed reasoning",
        })}
      />,
    );

    expect(screen.getByText("Detailed reasoning")).toBeInTheDocument();
  });

  it("hides status-literal content for review decision comments", () => {
    render(
      <CommentItem
        comment={makeComment({
          commentType: "review_suitable",
          content: "suitable",
        })}
      />,
    );

    expect(screen.queryByText("suitable")).not.toBeInTheDocument();
  });

  it("shows status-literal content for normal comments", () => {
    render(
      <CommentItem
        comment={makeComment({
          commentType: "normal",
          content: "suitable",
        })}
      />,
    );

    expect(screen.getByText("suitable")).toBeInTheDocument();
  });

  it('does not render review badge when commentType is "normal" or undefined', () => {
    const { rerender } = render(
      <CommentItem comment={makeComment({ commentType: "normal" })} />,
    );
    expect(
      screen.queryByTestId("review-decision-badge"),
    ).not.toBeInTheDocument();

    rerender(<CommentItem comment={makeComment()} />);
    expect(
      screen.queryByTestId("review-decision-badge"),
    ).not.toBeInTheDocument();
  });
});
