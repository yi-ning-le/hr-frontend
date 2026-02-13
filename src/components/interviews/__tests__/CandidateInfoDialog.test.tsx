// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CandidateInfoDialog } from "@/components/interviews/CandidateInfoDialog";
import type { Candidate } from "@/types/candidate";

vi.mock(
  "@/pages/recruitment/components/candidates/detail/CandidateInfoSection",
  () => ({
    CandidateInfoSection: ({ candidate }: { candidate: Candidate }) => (
      <div data-testid="candidate-info-section">
        <span>{candidate.name}</span>
        <span>{candidate.email}</span>
      </div>
    ),
  }),
);

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

describe("CandidateInfoDialog", () => {
  it("renders dialog when open is true", () => {
    render(
      <CandidateInfoDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getAllByText("John Doe").length).toBeGreaterThan(0);
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByTestId("candidate-info-section")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <CandidateInfoDialog
        candidate={mockCandidate}
        open={false}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("renders candidate info section with correct data", () => {
    render(
      <CandidateInfoDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const infoSection = screen.getByTestId("candidate-info-section");
    expect(infoSection).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });
});
