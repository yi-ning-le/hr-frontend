
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { JobPositionDetail } from "../JobPositionDetail";
import type { JobPosition } from "@/types/job";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock ExpandableText to simplify testing if complex interaction isn't the focus of parent
// But here the component *is* composed of details and ExpandableText, so we should testing its presence.
// However, since ExpandableText is defined inside the same file (not exported), it's an implementation detail.
// We can test the visible effect (rendering text).

describe("JobPositionDetail", () => {
  const mockJob: JobPosition = {
    id: "job-1",
    title: "Senior Engineer",
    department: "Engineering",
    status: "OPEN",
    headCount: 5,
    jobDescription: "Detailed description of the job which might be long...",
    requirements: "Requirements...",
    location: "New York",
    type: "Full-time",
    salaryRange: "150k-200k",
    hiringManager: "Jane Doe",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    openDate: new Date("2024-02-01"),
    note: "Internal notes"
  };

  it("renders job basic details correctly", () => {
    render(<JobPositionDetail job={mockJob} />);

    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
    // Status text (mocked translation key)
    expect(screen.getByText("recruitment.jobs.statusOptions.open")).toBeInTheDocument();

    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/2024-02-01/)).toBeInTheDocument();
  });

  it("renders description and notes", () => {
    render(<JobPositionDetail job={mockJob} />);

    expect(screen.getByText("Detailed description of the job which might be long...")).toBeInTheDocument();
    expect(screen.getByText("Internal notes")).toBeInTheDocument();
  });

  it("renders closed status correctly", () => {
    render(<JobPositionDetail job={{ ...mockJob, status: "CLOSED" }} />);

    expect(screen.getByText("recruitment.jobs.statusOptions.closed")).toBeInTheDocument();
  });

  it("renders dash for missing openDate", () => {
    // Cast to any to bypass strict typing for test case of missing Date object if type normally enforces it
    // But since the interface says openDate is mandatory (Date), passing undefined is technically a type error.
    // If the component handles it, we can force it, or fixing the type to Date | undefined if that's what we want.
    // Looking at the component: {job.openDate ? format(job.openDate, "yyyy-MM-dd") : "-"}
    // It seems to handle falsy values.
    // Tests often check edge cases.
    render(<JobPositionDetail job={{ ...mockJob, openDate: undefined as unknown as Date }} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
