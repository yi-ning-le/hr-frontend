// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CandidateReviewPanel } from "@/components/candidates/reviews/CandidateReviewPanel";
import type { Candidate } from "@/types/candidate";

const mockAddComment = vi.fn().mockResolvedValue({});
const mockReview = vi.fn().mockResolvedValue({});

vi.mock("@/hooks/queries/useCandidateComments", () => ({
  useCandidateComments: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useAddCandidateComment: vi.fn(() => ({
    mutateAsync: mockAddComment,
  })),
}));

vi.mock("@/lib/api", () => ({
  CandidatesAPI: {
    review: (...args: unknown[]) => mockReview(...args),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: "user-1", name: "Test User" },
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockCandidate: Candidate = {
  id: "candidate-1",
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  experienceYears: 5,
  education: "Bachelor",
  appliedJobId: "job-1",
  appliedJobTitle: "Frontend Developer",
  channel: "LinkedIn",
  resumeUrl: "https://example.com/resume.pdf",
  status: "new",
  appliedAt: new Date("2025-01-01T00:00:00.000Z"),
};

describe("CandidateReviewPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddComment.mockResolvedValue({});
    mockReview.mockResolvedValue({});
  });

  it("renders review buttons", () => {
    render(<CandidateReviewPanel candidate={mockCandidate} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getAllByText(/candidate\.unsuitable/).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText(/candidate\.suitable/).length).toBeGreaterThan(
      0,
    );
  });

  it("renders review actions section", () => {
    render(<CandidateReviewPanel candidate={mockCandidate} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getAllByText(/candidate\.reviewActions/).length,
    ).toBeGreaterThan(0);
  });

  it("renders comments section heading", () => {
    render(<CandidateReviewPanel candidate={mockCandidate} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getAllByText(/recruitment\.candidates\.comments\.title/).length,
    ).toBeGreaterThan(0);
  });

  it("renders main container", () => {
    const { container } = render(
      <CandidateReviewPanel candidate={mockCandidate} />,
      { wrapper: createWrapper() },
    );

    expect(container.querySelector(".flex.flex-col")).toBeInTheDocument();
  });

  // --- New: Comment-gating tests ---

  it("keeps review buttons enabled when no comment has been typed", () => {
    render(<CandidateReviewPanel candidate={mockCandidate} />, {
      wrapper: createWrapper(),
    });

    const suitableBtn = screen.getByRole("button", {
      name: /candidate\.suitable/,
    });
    const unsuitableBtn = screen.getByRole("button", {
      name: /candidate\.unsuitable/,
    });

    expect(suitableBtn).toBeEnabled();
    expect(unsuitableBtn).toBeEnabled();
  });

  it("keeps review buttons enabled after typing a comment", async () => {
    const user = userEvent.setup();
    render(<CandidateReviewPanel candidate={mockCandidate} />, {
      wrapper: createWrapper(),
    });

    // Type into the comment textarea
    const textareas = screen.getAllByRole("textbox");
    const commentTextarea = textareas[textareas.length - 1]; // last textarea is CommentInput
    await user.type(commentTextarea, "This candidate is qualified");

    const suitableBtn = screen.getByRole("button", {
      name: /candidate\.suitable/,
    });
    expect(suitableBtn).toBeEnabled();
  });

  it("does not show comment-required helper text", () => {
    render(<CandidateReviewPanel candidate={mockCandidate} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.queryByText(/candidate\.commentRequired/),
    ).not.toBeInTheDocument();
  });

  it("submits review directly when comment is empty", async () => {
    const user = userEvent.setup();
    render(
      <CandidateReviewPanel
        candidate={mockCandidate}
        onReviewSubmit={vi.fn()}
      />,
      { wrapper: createWrapper() },
    );

    const suitableBtn = screen.getByRole("button", {
      name: /candidate\.suitable/,
    });
    await user.click(suitableBtn);

    await waitFor(() => {
      expect(mockAddComment).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockReview).toHaveBeenCalledWith(
        "candidate-1",
        "suitable",
        undefined,
      );
    });
  });

  it("submits review with typed comment", async () => {
    const user = userEvent.setup();
    render(
      <CandidateReviewPanel
        candidate={mockCandidate}
        onReviewSubmit={vi.fn()}
      />,
      { wrapper: createWrapper() },
    );

    // Type a comment
    const textareas = screen.getAllByRole("textbox");
    const commentTextarea = textareas[textareas.length - 1];
    await user.type(commentTextarea, "Good candidate");

    // Click suitable
    const suitableBtn = screen.getByRole("button", {
      name: /candidate\.suitable/,
    });
    await user.click(suitableBtn);

    await waitFor(() => {
      expect(mockAddComment).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockReview).toHaveBeenCalledWith(
        "candidate-1",
        "suitable",
        "Good candidate",
      );
    });
  });

  it("submits unsuitable review with typed comment", async () => {
    const user = userEvent.setup();
    render(
      <CandidateReviewPanel
        candidate={mockCandidate}
        onReviewSubmit={vi.fn()}
      />,
      { wrapper: createWrapper() },
    );

    // Type a comment
    const textareas = screen.getAllByRole("textbox");
    const commentTextarea = textareas[textareas.length - 1];
    await user.type(commentTextarea, "Not a fit");

    // Click unsuitable
    const unsuitableBtn = screen.getByRole("button", {
      name: /candidate\.unsuitable/,
    });
    await user.click(unsuitableBtn);

    await waitFor(() => {
      expect(mockAddComment).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockReview).toHaveBeenCalledWith(
        "candidate-1",
        "unsuitable",
        "Not a fit",
      );
    });
  });

  it("keeps comment input when review request fails", async () => {
    mockReview.mockRejectedValueOnce(new Error("network error"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const user = userEvent.setup();
    render(
      <CandidateReviewPanel
        candidate={mockCandidate}
        onReviewSubmit={vi.fn()}
      />,
      { wrapper: createWrapper() },
    );

    const textareas = screen.getAllByRole("textbox");
    const commentTextarea = textareas[textareas.length - 1];
    await user.type(commentTextarea, "Keep this comment");

    const suitableBtn = screen.getByRole("button", {
      name: /candidate\.suitable/,
    });
    await user.click(suitableBtn);

    await waitFor(() => {
      expect(mockReview).toHaveBeenCalledWith(
        "candidate-1",
        "suitable",
        "Keep this comment",
      );
    });

    expect(commentTextarea).toHaveValue("Keep this comment");
    errorSpy.mockRestore();
  });
});
