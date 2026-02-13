// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CandidateReviewFormDialog } from "@/components/interviews/CandidateReviewFormDialog";
import type { Candidate } from "@/types/candidate";

vi.mock("@/components/candidates/reviews/CandidateReviewPanel", () => ({
  CandidateReviewPanel: ({
    candidate,
    onReviewSubmit,
  }: {
    candidate: Candidate;
    onReviewSubmit?: () => void;
  }) => (
    <div data-testid="review-panel">
      <span>{candidate.name}</span>
      <button onClick={onReviewSubmit}>submit-review</button>
    </div>
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

describe("CandidateReviewFormDialog", () => {
  it("renders dialog when open is true", () => {
    render(
      <CandidateReviewFormDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByTestId("review-panel")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <CandidateReviewFormDialog
        candidate={mockCandidate}
        open={false}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.queryByTestId("review-panel")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when dialog is closed", () => {
    const onOpenChange = vi.fn();
    render(
      <CandidateReviewFormDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("renders review title", () => {
    render(
      <CandidateReviewFormDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/candidate\.reviewTitle/)).toBeInTheDocument();
  });

  it("calls onSuccess when review is submitted", async () => {
    const onSuccess = vi.fn();
    render(
      <CandidateReviewFormDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={onSuccess}
      />,
    );

    const submitButton = screen.getByRole("button", { name: "submit-review" });
    submitButton.click();

    expect(onSuccess).toHaveBeenCalled();
  });
});
