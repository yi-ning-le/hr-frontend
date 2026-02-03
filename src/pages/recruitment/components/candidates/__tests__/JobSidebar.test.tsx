
// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { JobSidebar } from "../JobSidebar";
import type { JobPosition } from "@/types/job";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock ResizeObserver
vi.stubGlobal('ResizeObserver', class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
} as typeof globalThis.ResizeObserver);

describe("JobSidebar", () => {
  const mockJobs: JobPosition[] = [
    {
      id: "job-1",
      title: "Frontend Engineer",
      department: "Engineering",
      status: "OPEN",
      headCount: 2,
      jobDescription: "Description",
      openDate: new Date(),
    },
    {
      id: "job-2",
      title: "Product Manager",
      department: "Product",
      status: "OPEN",
      headCount: 1,
      jobDescription: "Description",
      openDate: new Date(),
    },
  ];

  const defaultProps = {
    jobs: mockJobs,
    selectedJobId: "all",
    onSelectJob: vi.fn(),
    jobCounts: { "job-1": 5, "job-2": 3 },
    totalCandidates: 8,
  };

  it("renders correctly with jobs", () => {
    render(<JobSidebar {...defaultProps} />);

    expect(screen.getByText("recruitment.candidates.sidebar.title")).toBeInTheDocument();
    expect(screen.getByText("recruitment.candidates.sidebar.allPositions")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument(); // Total candidates count

    // Check departments are rendered
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
  });

  it("filters jobs based on search query", async () => {
    render(<JobSidebar {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("recruitment.candidates.sidebar.searchPlaceholder");
    fireEvent.change(searchInput, { target: { value: "Frontend" } });

    // Engineering department should still be there (contains Frontend Engineer)
    expect(screen.getByText("Engineering")).toBeInTheDocument();

    // Expand the accordion to check if the job is there
    const engineeringTrigger = screen.getByText("Engineering");
    fireEvent.click(engineeringTrigger);

    fireEvent.change(searchInput, { target: { value: "NonExistent" } });

    expect(screen.queryByText("Engineering")).not.toBeInTheDocument();
  });

  it("calls onSelectJob when a job is clicked", async () => {
    render(<JobSidebar {...defaultProps} />);

    // Department should be expanded by default
    expect(screen.getByText("Frontend Engineer")).toBeVisible();

    const jobButton = screen.getByText("Frontend Engineer");
    fireEvent.click(jobButton);

    expect(defaultProps.onSelectJob).toHaveBeenCalledWith("job-1");
  });

  it("calls onSelectJob with 'all' when 'All Positions' is clicked", () => {
    render(<JobSidebar {...defaultProps} selectedJobId="job-1" />);

    const allPositionsButton = screen.getByText("recruitment.candidates.sidebar.allPositions");
    fireEvent.click(allPositionsButton);

    expect(defaultProps.onSelectJob).toHaveBeenCalledWith("all");
  });

  it("expands all departments by default", () => {
    render(<JobSidebar {...defaultProps} />);
    const engineeringTrigger = screen.getByText("Engineering").closest('button');
    expect(engineeringTrigger).toHaveAttribute('data-state', 'open');
  });
});
