import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePendingResumes } from "@/hooks/queries/usePendingResumes";
import PendingResumesPage from "../PendingResumesPage";

// Mock hooks and components
vi.mock("@/hooks/queries/usePendingResumes");

// Mock ReviewCandidateDialog to avoid complex interactions in page test
vi.mock("@/components/interviews/ReviewCandidateDialog", () => ({
  ReviewCandidateDialog: vi.fn(({ open, onOpenChange }) =>
    open ? (
      <div role="dialog">
        Mock Review Dialog
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
  ),
}));

// Mock CandidateViewDialog (it's local but likely not exported easily to mock, but we can verify its content presence)
// Actually CandidateViewDialog is defined IN component file, so we can't mock it easily unless we export it or mock the sub-components it uses.
// We can mock the sub-components: CandidateInfoSection, CandidateResumeSection, ResumePreviewModal.
vi.mock(
  "@/pages/recruitment/components/candidates/detail/CandidateInfoSection",
  () => ({
    CandidateInfoSection: () => (
      <div data-testid="candidate-info">Candidate Info</div>
    ),
  }),
);
vi.mock(
  "@/pages/recruitment/components/candidates/detail/CandidateResumeSection",
  () => ({
    CandidateResumeSection: () => (
      <div data-testid="candidate-resume">Candidate Resume</div>
    ),
  }),
);
vi.mock("@/pages/recruitment/components/candidates/ResumePreviewModal", () => ({
  ResumePreviewModal: () => (
    <div data-testid="resume-preview-modal">Resume Preview Modal</div>
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
    // Loader is an icon, we can look for it by class or structure, or generic loading text if we added it?
    // The implementation uses Loader2 icon.
    // Let's assume implementation returns a div with spinner.
    // We can't query by icon easily without test-id.
    // But we can check that table is NOT there.
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

  it("should open view dialog when View button is clicked", async () => {
    (usePendingResumes as any).mockReturnValue({
      data: mockCandidates,
      isLoading: false,
    });

    render(<PendingResumesPage />);

    const user = userEvent.setup();
    const viewButtons = screen.getAllByRole("button", { name: "View" });
    await user.click(viewButtons[0]); // Click John Doe's view

    // CandidateViewDialog should open
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Check for title in dialog specifically
    // We can use within(dialog) if we import it, or just exact logic
    // But since I don't want to change imports if I can help it:
    // The dialog title is h2. The table cell is td.
    expect(
      screen.getByRole("heading", { name: "John Doe" }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("candidate-info")).toBeInTheDocument();
    expect(screen.getByTestId("candidate-resume")).toBeInTheDocument();
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
    expect(screen.getByText("Mock Review Dialog")).toBeInTheDocument();
  });
});
