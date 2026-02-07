// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CandidateToolbar } from "../CandidateToolbar";
import type { CandidateStatus } from "@/types/candidate";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/hooks/useCandidateStatuses", () => ({
  useCandidateStatuses: () => ({
    statuses: [
      { id: "1", slug: "new", name: "New", type: "system", color: "#000000" },
      {
        id: "2",
        slug: "screening",
        name: "Screening",
        type: "system",
        color: "#000000",
      },
      {
        id: "3",
        slug: "interview",
        name: "Interview",
        type: "system",
        color: "#000000",
      },
      {
        id: "4",
        slug: "offer",
        name: "Offer",
        type: "system",
        color: "#000000",
      },
      {
        id: "5",
        slug: "hired",
        name: "Hired",
        type: "system",
        color: "#000000",
      },
      {
        id: "6",
        slug: "rejected",
        name: "Rejected",
        type: "system",
        color: "#000000",
      },
    ],
  }),
}));

// Mock AddCandidateDialog since we don't need to test its internals here
vi.mock("../AddCandidateDialog", () => ({
  AddCandidateDialog: () => (
    <button data-testid="add-candidate-btn">Add Candidate</button>
  ),
}));

// Mock DropdownMenu components to avoid complex DOM structures
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuCheckboxItem: ({
    children,
    onCheckedChange,
    checked,
  }: {
    children: React.ReactNode;
    onCheckedChange: (checked: boolean) => void;
    checked: boolean;
  }) => (
    <div
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
    >
      {children}
    </div>
  ),
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("CandidateToolbar", () => {
  const defaultProps = {
    searchQuery: "",
    onSearchChange: vi.fn(),
    statusFilter: [] as CandidateStatus[],
    onStatusFilterChange: vi.fn(),
  };

  it("renders correctly with default props", () => {
    render(<CandidateToolbar {...defaultProps} />);

    expect(
      screen.getByPlaceholderText(
        "recruitment.candidates.toolbar.searchPlaceholder",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.toolbar.statusFilter"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("add-candidate-btn")).toBeInTheDocument();
  });

  it("calls onSearchChange when input changes", () => {
    render(<CandidateToolbar {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      "recruitment.candidates.toolbar.searchPlaceholder",
    );
    fireEvent.change(searchInput, { target: { value: "test query" } });

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("test query");
  });

  it("renders status filter badge when filters are active", () => {
    render(
      <CandidateToolbar
        {...defaultProps}
        statusFilter={["new", "interview"]}
      />,
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("calls onStatusFilterChange when a status is toggled", () => {
    render(<CandidateToolbar {...defaultProps} />);

    const newStatusOption = screen.getByText(
      "recruitment.candidates.statusOptions.new",
    );
    fireEvent.click(newStatusOption);

    expect(defaultProps.onStatusFilterChange).toHaveBeenCalledWith(["new"]);
  });

  it("calls onStatusFilterChange with updated list when unchecking a status", () => {
    render(<CandidateToolbar {...defaultProps} statusFilter={["new"]} />);

    const newStatusOption = screen.getByText(
      "recruitment.candidates.statusOptions.new",
    );
    fireEvent.click(newStatusOption);

    expect(defaultProps.onStatusFilterChange).toHaveBeenCalledWith([]);
  });

  it("clears all filters when 'Clear Filter' is clicked", () => {
    // We need to pass at least one filter so the clear button appears
    render(<CandidateToolbar {...defaultProps} statusFilter={["new"]} />);

    const clearButton = screen.getByText("common.clearFilter");
    fireEvent.click(clearButton);

    expect(defaultProps.onStatusFilterChange).toHaveBeenCalledWith([]);
  });
});
