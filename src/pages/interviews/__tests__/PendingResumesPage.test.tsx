import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePendingResumes } from "@/hooks/queries/usePendingResumes";
import PendingResumesPage from "../PendingResumesPage";

// Mock hooks and components
vi.mock("@/hooks/queries/usePendingResumes");

// Mock CandidateReviewDialog
vi.mock("@/components/interviews/CandidateReviewDialog", () => ({
  CandidateReviewDialog: vi.fn(({ open, onOpenChange }) =>
    open ? (
      <div role="dialog">
        Mock Candidate Review Dialog
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue || key,
  }),
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}));

describe("PendingResumesPage", () => {
  const mockCandidates = [
    {
      id: "1",
      name: "John Doe",
      appliedJobTitle: "Developer",
      experienceYears: 5,
      appliedAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      appliedJobTitle: "Designer",
      experienceYears: 3,
      appliedAt: "2025-01-02T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state", () => {
    (usePendingResumes as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<PendingResumesPage />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should render list of candidates", () => {
    (usePendingResumes as any).mockReturnValue({
      data: mockCandidates,
      isLoading: false,
    });

    render(<PendingResumesPage />);

    expect(screen.getByText("Pending Resumes")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("Designer")).toBeInTheDocument();
  });

  it("should open review dialog when Review button is clicked", async () => {
    (usePendingResumes as any).mockReturnValue({
      data: mockCandidates,
      isLoading: false,
    });

    render(<PendingResumesPage />);

    const user = userEvent.setup();
    const reviewButtons = screen.getAllByRole("button", { name: "Review" });
    await user.click(reviewButtons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText("Mock Candidate Review Dialog"),
    ).toBeInTheDocument();
  });
});
