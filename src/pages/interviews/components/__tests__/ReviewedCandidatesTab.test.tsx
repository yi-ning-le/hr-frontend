import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useReviewedCandidates } from "@/hooks/queries/useReviewedCandidates";
import { ReviewedCandidatesTab } from "../ReviewedCandidatesTab";

vi.mock("@/hooks/queries/useReviewedCandidates", () => ({
  useReviewedCandidates: vi.fn(),
}));

const mockUseSearch = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/routes/_protected/pending-resumes", () => ({
  Route: {
    useSearch: () => mockUseSearch(),
    useNavigate: () => mockNavigate,
  },
}));

describe("ReviewedCandidatesTab", () => {
  const mockReviewedCandidates = [
    {
      id: "r1",
      name: "Alice Brown",
      appliedJobTitle: "Engineer",
      experienceYears: 7,
      appliedAt: "2025-01-05T00:00:00.000Z",
      reviewStatus: "suitable",
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
      reviewStatus: "suitable",
      status: "interview",
      reviewedAt: null,
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockUseSearch.mockReturnValue({ q: "", status: "all" });
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should render loading state when loading", () => {
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });
    render(<ReviewedCandidatesTab />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should render error state", () => {
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to load"),
    });
    render(<ReviewedCandidatesTab />);
    expect(screen.getByText("common.error.fetch")).toBeInTheDocument();
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("should render list of candidates", () => {
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockReviewedCandidates,
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ReviewedCandidatesTab />);

    expect(screen.getByText("Alice Brown")).toBeInTheDocument();
    expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
    expect(screen.getByText("candidate.reviewTime")).toBeInTheDocument();
    expect(screen.queryByText("common.actions")).not.toBeInTheDocument();
    expect(screen.queryByText("common.viewHistory")).not.toBeInTheDocument();
  });

  it("should display formatted review time and hyphen for unspecified time", () => {
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockReviewedCandidates,
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ReviewedCandidatesTab />);

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

    const charlieRow = screen.getByText("Charlie Davis").closest("tr");
    expect(within(charlieRow!).getByText("-")).toBeInTheDocument();
  });

  it("should navigate to filter reviewed candidates by name when typing in search", async () => {
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockReviewedCandidates,
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ReviewedCandidatesTab />);

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(
      "recruitment.candidates.searchPlaceholder",
    );

    await user.type(searchInput, "Alice");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockNavigate).toHaveBeenCalledWith({
      search: expect.any(Function),
      replace: true,
    });
  });

  it("should render filtered candidates if search param is provided", () => {
    mockUseSearch.mockReturnValue({ q: "Alice", status: "all" });
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockReviewedCandidates,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ReviewedCandidatesTab />);

    act(() => {
      vi.advanceTimersByTime(300); // trigger debounce
    });

    expect(screen.getByText("Alice Brown")).toBeInTheDocument();
    expect(screen.queryByText("Bob Wilson")).not.toBeInTheDocument();
    expect(screen.queryByText("Charlie Davis")).not.toBeInTheDocument();
  });

  it("should navigate to filter reviewed candidates by position when typing in search", async () => {
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockReviewedCandidates,
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ReviewedCandidatesTab />);

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const searchInput = screen.getByPlaceholderText(
      "recruitment.candidates.searchPlaceholder",
    );

    await user.type(searchInput, "Developer");

    expect(mockNavigate).toHaveBeenCalled();
  });

  it("should navigate to filter reviewed candidates by review status", async () => {
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockReviewedCandidates,
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ReviewedCandidatesTab />);

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const filterSelect = screen.getByLabelText("candidate.reviewStatusFilter");

    await user.selectOptions(filterSelect, "rejected");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockNavigate).toHaveBeenCalledWith({
      search: expect.any(Function),
      replace: true,
    });
  });

  it("should render empty state when search param yields no results", () => {
    mockUseSearch.mockReturnValue({ q: "Nonexistent", status: "all" });
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockReviewedCandidates,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ReviewedCandidatesTab />);

    act(() => {
      vi.advanceTimersByTime(300); // trigger debounce
    });

    expect(screen.queryByText("Alice Brown")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob Wilson")).not.toBeInTheDocument();
    expect(screen.queryByText("Charlie Davis")).not.toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.noHistory"),
    ).toBeInTheDocument();
  });

  it("should normalize invalid status param to all", () => {
    mockUseSearch.mockReturnValue({ q: "", status: "invalid" });
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockReviewedCandidates,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ReviewedCandidatesTab />);

    const filterSelect = screen.getByLabelText("candidate.reviewStatusFilter");
    expect(filterSelect).toHaveValue("all");

    expect(mockNavigate).toHaveBeenCalledWith({
      search: expect.any(Function),
      replace: true,
    });
  });

  it("should show empty state when no candidates are furnished", () => {
    (useReviewedCandidates as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ReviewedCandidatesTab />);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.noHistory"),
    ).toBeInTheDocument();
  });
});
