// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CandidateReviewDialog } from "@/components/interviews/CandidateReviewDialog";
import type { Candidate } from "@/types/candidate";

// Mock the child components
vi.mock("@/components/candidates/PdfPreview", () => ({
  PdfPreview: () => <div data-testid="pdf-preview">PDF Preview</div>,
}));

vi.mock("@/components/candidates/reviews/CandidateReviewPanel", () => ({
  CandidateReviewPanel: ({
    onReviewSubmit,
  }: {
    onReviewSubmit: () => void;
  }) => (
    <div data-testid="review-panel">
      Review Panel
      <button onClick={onReviewSubmit} data-testid="submit-review">
        Submit Review
      </button>
    </div>
  ),
}));

// Mock the dialog component parts since Radix UI dialogs can be tricky in tests
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }: any) =>
    open ? (
      <div data-testid="dialog-root">
        <button onClick={() => onOpenChange(false)} data-testid="close-dialog">
          Close
        </button>
        {children}
      </div>
    ) : null,
  DialogContent: ({ children, className }: any) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogClose: ({ children }: any) => <>{children}</>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

// Mock VisuallyHidden
vi.mock("@radix-ui/react-visually-hidden", () => ({
  Root: ({ children }: any) => (
    <div data-testid="visually-hidden">{children}</div>
  ),
}));

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

describe("CandidateReviewDialog", () => {
  it("renders the single split-screen dialog correctly", () => {
    render(
      <CandidateReviewDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    // Check for main dialog content
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();

    // Check for split panes
    expect(screen.getByTestId("pdf-preview")).toBeInTheDocument();
    expect(screen.getByTestId("review-panel")).toBeInTheDocument();

    // Check for candidate info
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("handles missing resume correctly", () => {
    const candidateNoResume = {
      ...mockCandidate,
      resumeUrl: undefined,
    } as unknown as Candidate;

    render(
      <CandidateReviewDialog
        candidate={candidateNoResume}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.queryByTestId("pdf-preview")).not.toBeInTheDocument();
    expect(screen.getByText("candidate.noResumeTitle")).toBeInTheDocument();
  });

  it("calls onOpenChange when close button is clicked", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CandidateReviewDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByTestId("close-dialog"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes dialog when review is submitted", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CandidateReviewDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByTestId("submit-review"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
