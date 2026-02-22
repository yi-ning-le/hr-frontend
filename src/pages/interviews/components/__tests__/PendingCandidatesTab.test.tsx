import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePendingResumes } from "@/hooks/queries/usePendingResumes";
import { makeCandidate } from "@/test/factories/candidate";
import { PendingCandidatesTab } from "../PendingCandidatesTab";

vi.mock("@/hooks/queries/usePendingResumes", () => ({
  usePendingResumes: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockUseSearch = vi.fn();

vi.mock("@/routes/_protected/pending-resumes", () => ({
  Route: {
    useNavigate: vi.fn(() => mockNavigate),
    useSearch: () => mockUseSearch(),
  },
}));

describe("PendingCandidatesTab", () => {
  const mockCandidates = [
    makeCandidate({
      id: "1",
      name: "John Doe",
      appliedJobTitle: "Developer",
      experienceYears: 5,
      appliedAt: new Date("2025-01-01T00:00:00.000Z"),
    }),
    makeCandidate({
      id: "2",
      name: "Jane Smith",
      appliedJobTitle: "Designer",
      experienceYears: 3,
      appliedAt: new Date("2025-01-02T00:00:00.000Z"),
    }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearch.mockReturnValue({
      reviewCandidateId: undefined,
    });
  });

  it("should render loading state when loading", () => {
    (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });
    render(<PendingCandidatesTab />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should render error state", () => {
    (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to load"),
    });
    render(<PendingCandidatesTab />);
    expect(screen.getByText("common.error.fetch")).toBeInTheDocument();
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("should render list of candidates", () => {
    (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCandidates,
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<PendingCandidatesTab />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("Designer")).toBeInTheDocument();
    expect(screen.getByText("recruitment.candidates.name")).toBeInTheDocument();
    expect(screen.getByText("common.actions")).toBeInTheDocument();
  });

  it("should open review dialog when Review button is clicked", async () => {
    (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCandidates,
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<PendingCandidatesTab />);

    const user = userEvent.setup();
    const reviewButtons = screen.getAllByRole("button", {
      name: "recruitment.candidates.review",
    });

    await user.click(reviewButtons[0]);
    expect(mockNavigate).toHaveBeenCalled();
    const call = mockNavigate.mock.calls.find(
      (c: unknown[]) =>
        typeof (c[0] as Record<string, unknown>)?.search === "function",
    );
    expect(call).toBeDefined();

    const searchFn = (
      call?.[0] as {
        search: (prev: Record<string, unknown>) => Record<string, unknown>;
      }
    ).search;
    const result = searchFn({ reviewCandidateId: undefined });
    expect(result).toEqual({ reviewCandidateId: "1" });
  });

  it("should display empty state when there are no candidates", () => {
    (usePendingResumes as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<PendingCandidatesTab />);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.noPendingResumes"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.noPendingResumesDesc"),
    ).toBeInTheDocument();
  });
});
