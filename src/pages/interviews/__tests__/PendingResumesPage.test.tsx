import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
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

const mockNavigate = vi.fn();
const mockUseSearch = vi.fn();

vi.mock("@/routes/_protected/pending-resumes", () => ({
  Route: {
    useNavigate: vi.fn(() => mockNavigate),
    useSearch: () => mockUseSearch(),
  },
}));

// Mock CandidateReviewDialog
vi.mock("@/components/interviews/CandidateReviewDialog", () => ({
  CandidateReviewDialog: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
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

  const mockReviewedCandidates = [
    {
      id: "r1",
      name: "Alice Brown",
      appliedJobTitle: "Engineer",
      experienceYears: 7,
      appliedAt: "2025-01-05T00:00:00.000Z",
      reviewStatus: "approved",
      status: "interview",
      reviewedAt: "2025-01-10T14:30:00.000Z",
    },
    {
      id: "r2",
      name: "Bob Wilson",
      appliedJobTitle: "Manager",
      experienceYears: 10,
      appliedAt: "2025-01-06T00:00:00.000Z",
      reviewStatus: "rejected",
      status: "rejected",
      reviewedAt: "2025-01-11T09:15:00.000Z",
    },
    {
      id: "r3",
      name: "Charlie Davis",
      appliedJobTitle: "Developer",
      experienceYears: 4,
      appliedAt: "2025-01-07T00:00:00.000Z",
      reviewStatus: "approved",
      status: "interview",
      reviewedAt: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearch.mockReturnValue({
      reviewCandidateId: undefined,
      tab: "pending",
    });
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it("should render loading state when pending resumes are loading", () => {
    (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<PendingResumesPage />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should render list of candidates", () => {
    (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
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
    (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCandidates,
      isLoading: false,
      isError: false,
    });
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<PendingResumesPage />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeInTheDocument();
  });

  it("should open review dialog when Review button is clicked", async () => {
    (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCandidates,
      isLoading: false,
    });
    mockUseSearch.mockReturnValue({
      reviewCandidateId: undefined,
      tab: "pending",
    });

    render(<PendingResumesPage />);

    const user = userEvent.setup();
    const reviewButtons = screen.getAllByRole("button", {
      name: "recruitment.candidates.review",
    });

    // Simulate clicking the review button
    await user.click(reviewButtons[0]);

    // Our component now calls navigate to set the search param, rather than setting local state.
    // So we need to assert that navigate was called correctly, and simulate the URL param update.
    expect(mockNavigate).toHaveBeenCalled();
    const call = mockNavigate.mock.calls.find(
      (c: unknown[]) =>
        typeof (c[0] as Record<string, unknown>)?.search === "function",
    );
    expect(call).toBeDefined();

    // Now manually trigger the re-render with the updated hook value as if navigate worked
    mockUseSearch.mockReturnValue({
      reviewCandidateId: mockCandidates[0].id,
      tab: "pending",
    });

    render(<PendingResumesPage />);

    // Now the dialog should be open
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText("Mock Candidate Review Dialog"),
    ).toBeInTheDocument();
  });

  // === Tab Persistence Tests ===

  describe("tab persistence in route", () => {
    it("should default to pending tab when tab search param is undefined", () => {
      mockUseSearch.mockReturnValue({
        reviewCandidateId: undefined,
        tab: "pending",
      });
      (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockCandidates,
        isLoading: false,
      });

      render(<PendingResumesPage />);

      // Pending tab content should be visible
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should show reviewed tab when tab search param is 'reviewed'", () => {
      mockUseSearch.mockReturnValue({
        reviewCandidateId: undefined,
        tab: "reviewed",
      });
      (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockCandidates,
        isLoading: false,
      });
      (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockReviewedCandidates,
        isLoading: false,
      });

      render(<PendingResumesPage />);

      // Reviewed tab content should be visible
      expect(screen.getByText("Alice Brown")).toBeInTheDocument();
      expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
    });

    it("should call navigate with tab param when switching tabs", async () => {
      (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockCandidates,
        isLoading: false,
      });
      (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockReviewedCandidates,
        isLoading: false,
      });

      render(<PendingResumesPage />);

      const user = userEvent.setup();
      const reviewedTab = screen.getByRole("tab", {
        name: /recruitment\.candidates\.reviewedListTitle/i,
      });
      await user.click(reviewedTab);

      expect(mockNavigate).toHaveBeenCalled();
      const call = mockNavigate.mock.calls.find(
        (c: unknown[]) =>
          typeof (c[0] as Record<string, unknown>)?.search === "function",
      );
      expect(call).toBeDefined();
      const searchFn = (
        call![0] as {
          search: (prev: Record<string, unknown>) => Record<string, unknown>;
        }
      ).search;
      const result = searchFn({ reviewCandidateId: undefined, tab: "pending" });
      expect(result).toEqual(expect.objectContaining({ tab: "reviewed" }));
    });
  });

  // === Reviewed Tab - Review Time Column ===

  describe("reviewed tab - review time column", () => {
    beforeEach(() => {
      mockUseSearch.mockReturnValue({
        reviewCandidateId: undefined,
        tab: "reviewed",
      });
      (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [],
        isLoading: false,
      });
      (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockReviewedCandidates,
        isLoading: false,
      });
    });

    it("should show Review Time column header without actions column", () => {
      render(<PendingResumesPage />);

      expect(screen.getByText("candidate.reviewTime")).toBeInTheDocument();
      expect(screen.queryByText("common.actions")).not.toBeInTheDocument();
      expect(screen.queryByText("common.viewHistory")).not.toBeInTheDocument();
    });

    it("should display formatted review time for reviewed candidates", () => {
      render(<PendingResumesPage />);

      // Use format() to match what the component does with the local timezone
      const aliceReviewTime = format(
        new Date("2025-01-10T14:30:00.000Z"),
        "yyyy-MM-dd HH:mm",
      );
      const bobReviewTime = format(
        new Date("2025-01-11T09:15:00.000Z"),
        "yyyy-MM-dd HH:mm",
      );
      expect(screen.getByText(aliceReviewTime)).toBeInTheDocument();
      expect(screen.getByText(bobReviewTime)).toBeInTheDocument();
    });

    it("should display dash when reviewedAt is null", () => {
      render(<PendingResumesPage />);

      // Charlie has reviewedAt: null → should show "-"
      const charlieRow = screen.getByText("Charlie Davis").closest("tr");
      expect(charlieRow).toBeInTheDocument();
      expect(within(charlieRow!).getByText("-")).toBeInTheDocument();
    });
  });

  // === Reviewed Tab - Search & Filter ===

  describe("reviewed tab - search and filter", () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      mockUseSearch.mockReturnValue({
        reviewCandidateId: undefined,
        tab: "reviewed",
        q: "",
        status: "all",
      });
      (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [],
        isLoading: false,
      });
      (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockReviewedCandidates,
        isLoading: false,
      });
      mockNavigate.mockClear();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should have a search input on the reviewed tab", () => {
      render(<PendingResumesPage />);

      const searchInput = screen.getByPlaceholderText(
        "recruitment.candidates.searchPlaceholder",
      );
      expect(searchInput).toBeInTheDocument();
    });

    it("should navigate to filter reviewed candidates by name when typing in search", async () => {
      render(<PendingResumesPage />);

      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const searchInput = screen.getByPlaceholderText(
        "recruitment.candidates.searchPlaceholder",
      );

      await user.type(searchInput, "Alice");

      expect(mockNavigate).toHaveBeenCalledWith({
        search: expect.any(Function),
        replace: true,
      });
    });

    it("should navigate to filter reviewed candidates by position when typing in search", async () => {
      render(<PendingResumesPage />);

      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const searchInput = screen.getByPlaceholderText(
        "recruitment.candidates.searchPlaceholder",
      );

      await user.type(searchInput, "Developer");

      expect(mockNavigate).toHaveBeenCalledWith({
        search: expect.any(Function),
        replace: true,
      });
    });

    it("should have a review status filter dropdown", () => {
      render(<PendingResumesPage />);

      const filterSelect = screen.getByLabelText(
        "candidate.reviewStatusFilter",
      );
      expect(filterSelect).toBeInTheDocument();
    });

    it("should navigate to filter reviewed candidates by review status", async () => {
      render(<PendingResumesPage />);

      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const filterSelect = screen.getByLabelText(
        "candidate.reviewStatusFilter",
      );

      await user.selectOptions(filterSelect, "rejected");

      expect(mockNavigate).toHaveBeenCalledWith({
        search: expect.any(Function),
        replace: true,
      });
    });

    it("should show empty state when search param yields no results", () => {
      mockUseSearch.mockReturnValue({
        reviewCandidateId: undefined,
        tab: "reviewed",
        q: "Nonexistent",
        status: "all",
      });

      render(<PendingResumesPage />);

      expect(screen.queryByText("Alice Brown")).not.toBeInTheDocument();
      expect(screen.queryByText("Bob Wilson")).not.toBeInTheDocument();
      expect(screen.queryByText("Charlie Davis")).not.toBeInTheDocument();
      expect(
        screen.getByText("recruitment.candidates.noHistory"),
      ).toBeInTheDocument();
    });
  });
});
