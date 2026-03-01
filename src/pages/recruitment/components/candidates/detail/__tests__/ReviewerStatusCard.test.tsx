// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { ReviewerStatusCard } from "../ReviewerStatusCard";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: { language: "en-US", changeLanguage: vi.fn() },
  }),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock the hook
const mockRevertReviewer = vi.fn();
vi.mock("@/hooks/queries/useCandidates", () => ({
  useRevertReviewer: () => ({
    mutateAsync: mockRevertReviewer,
    isPending: false,
  }),
}));

const mockCandidate: Candidate = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  experienceYears: 5,
  education: "Bachelor Degree",
  appliedJobId: "job1",
  appliedJobTitle: "Developer",
  channel: "LinkedIn",
  resumeUrl: "resume.pdf",
  status: "new",
  appliedAt: new Date("2024-01-15T10:30:00"),
  reviewerId: "reviewer-1",
  reviewerName: "Alice Reviewer",
  reviewStatus: "pending",
};

describe("ReviewerStatusCard", () => {
  const onUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when review status is pending", () => {
    render(
      <ReviewerStatusCard candidate={mockCandidate} onUpdate={onUpdate} />,
    );
    expect(screen.getByText("Reviewer")).toBeInTheDocument();
    expect(screen.getByText("Alice Reviewer")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("does not render when review status is suitable", () => {
    const suitableCandidate = { ...mockCandidate, reviewStatus: "suitable" };
    const { container } = render(
      <ReviewerStatusCard candidate={suitableCandidate} onUpdate={onUpdate} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not render when review status is unsuitable", () => {
    const unsuitableCandidate = {
      ...mockCandidate,
      reviewStatus: "unsuitable",
    };
    const { container } = render(
      <ReviewerStatusCard
        candidate={unsuitableCandidate}
        onUpdate={onUpdate}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders 'No reviewer assigned' when reviewer is missing and status is pending", () => {
    const noReviewerCandidate = {
      ...mockCandidate,
      reviewerId: undefined,
      reviewerName: undefined,
    };
    render(
      <ReviewerStatusCard
        candidate={noReviewerCandidate}
        onUpdate={onUpdate}
      />,
    );
    expect(screen.getByText("No reviewer assigned")).toBeInTheDocument();
  });

  it("triggers revert dialog and calls onUpdate on success", async () => {
    mockRevertReviewer.mockResolvedValueOnce({});
    render(
      <ReviewerStatusCard candidate={mockCandidate} onUpdate={onUpdate} />,
    );

    const revertBtn = screen.getByText("Revert");
    fireEvent.click(revertBtn);

    expect(screen.getByText("Revert Reviewer Assignment")).toBeInTheDocument();

    // Find the button in the dialog (there might be multiple 'Revert' texts, one in the button we just clicked and one in the dialog)
    // Actually the button in dialog is variant destructive
    const confirmBtn = screen
      .getAllByText("Revert")
      .find((el) => el.closest("button")?.classList.contains("bg-destructive"));
    if (!confirmBtn) throw new Error("Confirm button not found");

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockRevertReviewer).toHaveBeenCalledWith("1");
      expect(onUpdate).toHaveBeenCalled();
    });
  });
});
