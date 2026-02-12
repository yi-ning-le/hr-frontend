import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CandidateComment } from "@/types/candidate";
import { CommentList } from "../CommentList";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: { language: "en" },
  }),
}));

vi.mock("date-fns", () => ({
  formatDistanceToNow: vi.fn(() => "2 days ago"),
}));

vi.mock("date-fns/locale", () => ({
  enUS: {},
  zhCN: {},
}));

const makeComment = (
  overrides: Partial<CandidateComment> = {},
): CandidateComment => ({
  id: "c1",
  candidateId: "cand1",
  authorId: "auth1",
  authorName: "John Doe",
  authorRole: "HR",
  content: "Test comment",
  createdAt: "2025-01-15T10:00:00Z",
  ...overrides,
});

describe("CommentList", () => {
  it("shows loading skeletons when isLoading is true", () => {
    const { container } = render(
      <CommentList comments={[]} isLoading={true} />,
    );

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("shows empty state message when comments array is empty", () => {
    render(<CommentList comments={[]} isLoading={false} />);

    expect(
      screen.getByText("recruitment.candidates.comments.empty"),
    ).toBeInTheDocument();
  });

  it("renders all comments when comments are provided", () => {
    const comments = [
      makeComment({ id: "c1", authorName: "Alice", content: "First comment" }),
      makeComment({ id: "c2", authorName: "Bob", content: "Second comment" }),
    ];

    render(<CommentList comments={comments} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("First comment")).toBeInTheDocument();
    expect(screen.getByText("Second comment")).toBeInTheDocument();
  });

  it("renders correct number of CommentItem components", () => {
    const comments = [
      makeComment({ id: "c1" }),
      makeComment({ id: "c2" }),
      makeComment({ id: "c3" }),
    ];

    const { container } = render(<CommentList comments={comments} />);

    // Each CommentItem is a direct child div with flex gap-3
    const items = container.querySelectorAll(".flex.gap-3");
    expect(items).toHaveLength(3);
  });
});
