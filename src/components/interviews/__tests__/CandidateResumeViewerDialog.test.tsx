// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CandidateResumeViewerDialog } from "@/components/interviews/CandidateResumeViewerDialog";
import type { Candidate } from "@/types/candidate";

vi.mock("@/components/candidates/CandidateResumeSection", () => ({
  CandidateResumeSection: () => (
    <div data-testid="resume-section">Resume Section</div>
  ),
}));

vi.mock("@/components/candidates/PdfPreview", () => ({
  PdfPreview: ({ pdfUrl }: { pdfUrl: string }) => (
    <div data-testid="pdf-preview">PDF: {pdfUrl}</div>
  ),
}));

vi.mock("@/components/candidates/reviews/CandidateReviewPanel", () => ({
  CandidateReviewPanel: () => (
    <div data-testid="review-panel">Review Panel</div>
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

describe("CandidateResumeViewerDialog", () => {
  it("renders dialog when open is true", () => {
    render(
      <CandidateResumeViewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <CandidateResumeViewerDialog
        candidate={mockCandidate}
        open={false}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("shows Info button when onOpenInfo is provided", () => {
    render(
      <CandidateResumeViewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
        onOpenInfo={vi.fn()}
      />,
    );

    expect(screen.getByText(/candidate\.viewInfo/)).toBeInTheDocument();
  });

  it("renders PdfPreview when resumeUrl is valid", () => {
    render(
      <CandidateResumeViewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("pdf-preview")).toBeInTheDocument();
    expect(
      screen.getByText("PDF: https://example.com/resume.pdf"),
    ).toBeInTheDocument();
  });

  it("renders resume section when resumeUrl is invalid", () => {
    const candidateWithoutResume = {
      ...mockCandidate,
      resumeUrl: "#",
    };

    render(
      <CandidateResumeViewerDialog
        candidate={candidateWithoutResume}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("resume-section")).toBeInTheDocument();
  });

  it("renders review panel", () => {
    render(
      <CandidateResumeViewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("review-panel")).toBeInTheDocument();
  });
});
