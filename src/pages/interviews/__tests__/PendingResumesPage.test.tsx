// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePendingResumes } from "@/hooks/queries/usePendingResumes";
import { useReviewedCandidates } from "@/hooks/queries/useReviewedCandidates";
import PendingResumesPage from "../PendingResumesPage";

// Mock hooks and components
vi.mock("@/hooks/queries/usePendingResumes", () => ({
  usePendingResumes: vi.fn(),
}));
vi.mock("@/hooks/queries/useReviewedCandidates", () => ({
  useReviewedCandidates: vi.fn(),
}));

vi.mock("@/routes/_protected/pending-resumes", () => ({
  Route: {
    useNavigate: vi.fn(() => vi.fn()),
    useSearch: vi.fn(() => ({ reviewCandidateId: undefined })),
  },
}));

// Mock CandidateReviewDialog
vi.mock("@/components/interviews/CandidateReviewDialog", () => ({
  CandidateReviewDialog: ({ open, onOpenChange }: any) =>
    open ? (
      <div role="dialog">
        Mock Candidate Review Dialog
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
}));

// react-i18next is already mocked globally in src/test/i18n-mock.ts
// so we don't need to mock it here again

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
    (useReviewedCandidates as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it("should render loading state when pending resumes are loading", () => {
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

    expect(screen.getAllByText("nav.pendingResumes")[0]).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("Designer")).toBeInTheDocument();
  });

  it("should not block pending list when reviewed data is loading", () => {
    (usePendingResumes as any).mockReturnValue({
      data: mockCandidates,
      isLoading: false,
      isError: false,
    });
    (useReviewedCandidates as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<PendingResumesPage />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeInTheDocument();
  });

  it("should open review dialog when Review button is clicked", async () => {
    (usePendingResumes as any).mockReturnValue({
      data: mockCandidates,
      isLoading: false,
    });

    render(<PendingResumesPage />);

    const user = userEvent.setup();
    const reviewButtons = screen.getAllByRole("button", {
      name: "recruitment.candidates.review",
    });
    await user.click(reviewButtons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText("Mock Candidate Review Dialog"),
    ).toBeInTheDocument();
  });
});
