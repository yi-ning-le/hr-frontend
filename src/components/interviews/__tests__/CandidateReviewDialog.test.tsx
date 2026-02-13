// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CandidateReviewDialog } from "@/components/interviews/CandidateReviewDialog";
import type { Candidate } from "@/types/candidate";

vi.mock("@/components/interviews/CandidateResumeViewerDialog", () => ({
  CandidateResumeViewerDialog: ({
    open,
    onOpenChange,
    onOpenInfo,
    onReviewSubmit,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenInfo?: () => void;
    onReviewSubmit?: () => void;
  }) =>
    open ? (
      <div data-testid="resume-viewer">
        <button onClick={() => onOpenInfo?.()}>open-info</button>
        <button onClick={() => onReviewSubmit?.()}>submit-review</button>
        <button onClick={() => onOpenChange(false)}>close-viewer</button>
      </div>
    ) : null,
}));

vi.mock("@/components/interviews/CandidateInfoDialog", () => ({
  CandidateInfoDialog: ({
    open,
    onOpenChange,
    onOpenResume,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenResume?: () => void;
  }) =>
    open ? (
      <div data-testid="info-dialog">
        <button onClick={() => onOpenResume?.()}>back-to-resume</button>
        <button onClick={() => onOpenChange(false)}>close-info</button>
      </div>
    ) : null,
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
  it("opens with resume viewer by default", () => {
    render(
      <CandidateReviewDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("resume-viewer")).toBeInTheDocument();
    expect(screen.queryByTestId("info-dialog")).not.toBeInTheDocument();
  });

  it("opens info as floating overlay without closing resume viewer", async () => {
    const user = userEvent.setup();

    render(
      <CandidateReviewDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "open-info" }));
    expect(screen.getByTestId("resume-viewer")).toBeInTheDocument();
    expect(screen.getByTestId("info-dialog")).toBeInTheDocument();
  });

  it("can close info overlay and keep resume viewer open", async () => {
    const user = userEvent.setup();

    render(
      <CandidateReviewDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "open-info" }));
    expect(screen.getByTestId("info-dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "close-info" }));
    expect(screen.getByTestId("resume-viewer")).toBeInTheDocument();
    expect(screen.queryByTestId("info-dialog")).not.toBeInTheDocument();
  });

  it("closes parent dialog after submitting review", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <CandidateReviewDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "submit-review" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
