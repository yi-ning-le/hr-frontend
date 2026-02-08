import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { JobPosition } from "@/types/job";
import { JobDialogs } from "../JobDialogs";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock child components using correct relative paths
vi.mock("../forms/JobPositionForm", () => ({
  JobPositionForm: () => <div data-testid="job-form">JobPositionForm</div>,
}));

vi.mock("../JobPositionDetail", () => ({
  JobPositionDetail: () => (
    <div data-testid="job-detail">JobPositionDetail</div>
  ),
}));

describe("JobDialogs", () => {
  it("does not render any dialog content when closed", () => {
    render(
      <JobDialogs
        isDialogOpen={false}
        setIsDialogOpen={vi.fn()}
        editingJob={undefined}
        handleSaveJob={vi.fn()}
        viewingJob={undefined}
        setViewingJob={vi.fn()}
      />,
    );
    expect(screen.queryByTestId("job-form")).not.toBeInTheDocument();
  });

  it("renders add job title when editingJob is undefined", () => {
    render(
      <JobDialogs
        isDialogOpen={true}
        setIsDialogOpen={vi.fn()}
        editingJob={undefined}
        handleSaveJob={vi.fn()}
        viewingJob={undefined}
        setViewingJob={vi.fn()}
      />,
    );

    expect(
      screen.getByText("recruitment.jobs.dialog.addTitle"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("job-form")).toBeInTheDocument();
  });

  it("renders edit job title when editingJob is provided", () => {
    const mockJob = { id: "1", title: "Test Job" } as JobPosition;
    render(
      <JobDialogs
        isDialogOpen={true}
        setIsDialogOpen={vi.fn()}
        editingJob={mockJob}
        handleSaveJob={vi.fn()}
        viewingJob={undefined}
        setViewingJob={vi.fn()}
      />,
    );

    expect(
      screen.getByText("recruitment.jobs.dialog.editTitle"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("job-form")).toBeInTheDocument();
  });

  it("renders job detail when viewingJob is provided", () => {
    const mockJob = { id: "1", title: "Test Job" } as JobPosition;
    render(
      <JobDialogs
        isDialogOpen={false}
        setIsDialogOpen={vi.fn()}
        editingJob={undefined}
        handleSaveJob={vi.fn()}
        viewingJob={mockJob}
        setViewingJob={vi.fn()}
      />,
    );

    expect(screen.getByTestId("job-detail")).toBeInTheDocument();
  });
});
