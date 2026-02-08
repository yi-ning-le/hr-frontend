import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { JobPosition } from "@/types/job";
import { JobPositionList } from "../JobPositionList";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

const mockJobs: JobPosition[] = [
  {
    id: "1",
    title: "Software Engineer",
    department: "Engineering",
    headCount: 3,
    openDate: new Date("2024-01-01"),
    jobDescription: "Description",
    status: "OPEN",
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    headCount: 1,
    openDate: new Date("2024-01-15"),
    jobDescription: "Description",
    status: "CLOSED",
  },
];

describe("JobPositionList", () => {
  it("renders job list with correct headers", () => {
    render(<JobPositionList jobs={[]} onEdit={vi.fn()} />);

    // Matched with actual component keys
    expect(screen.getByText("recruitment.jobs.name")).toBeInTheDocument();
    expect(screen.getByText("recruitment.jobs.department")).toBeInTheDocument();
    expect(screen.getByText("recruitment.jobs.headCount")).toBeInTheDocument();
    expect(screen.getByText("recruitment.jobs.openDate")).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.jobs.quickAction"),
    ).toBeInTheDocument();
    expect(screen.getByText("recruitment.jobs.note")).toBeInTheDocument();

    // Status header appears multiple times (table header + filter)
    const statusHeaders = screen.getAllByText("recruitment.jobs.status");
    expect(statusHeaders.length).toBeGreaterThan(0);
  });

  it("renders correct number of job rows", () => {
    render(<JobPositionList jobs={mockJobs} onEdit={vi.fn()} />);

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Product Manager")).toBeInTheDocument();
  });

  it("displays correct status for jobs", () => {
    render(<JobPositionList jobs={mockJobs} onEdit={vi.fn()} />);

    // Matched with actual component keys
    expect(
      screen.getAllByText("recruitment.jobs.statusOptions.open").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("recruitment.jobs.statusOptions.closed").length,
    ).toBeGreaterThan(0);
  });
});
