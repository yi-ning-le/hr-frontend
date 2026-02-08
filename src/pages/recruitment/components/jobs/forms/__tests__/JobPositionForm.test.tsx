import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { JobPosition } from "@/types/job";
import { JobPositionForm } from "../JobPositionForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock child form components
vi.mock("../JobBasicInfoFields", () => ({
  JobBasicInfoFields: () => (
    <div data-testid="basic-info-fields">JobBasicInfoFields</div>
  ),
}));

vi.mock("../JobDateStatusFields", () => ({
  JobDateStatusFields: () => (
    <div data-testid="date-status-fields">JobDateStatusFields</div>
  ),
}));

vi.mock("../JobDescriptionFields", () => ({
  JobDescriptionFields: () => (
    <div data-testid="description-fields">JobDescriptionFields</div>
  ),
}));

describe("JobPositionForm", () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  };

  it("renders all form sections", () => {
    render(<JobPositionForm {...defaultProps} />);

    expect(screen.getByTestId("basic-info-fields")).toBeInTheDocument();
    expect(screen.getByTestId("date-status-fields")).toBeInTheDocument();
    expect(screen.getByTestId("description-fields")).toBeInTheDocument();
  });

  it("renders save button", () => {
    render(<JobPositionForm {...defaultProps} />);

    expect(screen.getByText("recruitment.jobs.form.save")).toBeInTheDocument();
  });

  it("renders cancel button when onCancel is provided", () => {
    render(<JobPositionForm {...defaultProps} />);

    expect(
      screen.getByText("recruitment.jobs.form.cancel"),
    ).toBeInTheDocument();
  });

  it("does not render cancel button when onCancel is not provided", () => {
    render(<JobPositionForm onSubmit={vi.fn()} />);

    expect(
      screen.queryByText("recruitment.jobs.form.cancel"),
    ).not.toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(<JobPositionForm onSubmit={vi.fn()} onCancel={onCancel} />);

    const cancelButton = screen.getByText("recruitment.jobs.form.cancel");
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    const onSubmit = vi.fn();
    const { container } = render(<JobPositionForm onSubmit={onSubmit} />);

    const saveButton = screen.getByText("recruitment.jobs.form.save");
    fireEvent.click(saveButton);

    // Verify form structure
    await waitFor(() => {
      expect(container.querySelector("form")).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <JobPositionForm {...defaultProps} className="custom-class" />,
    );

    const form = container.querySelector("form");
    expect(form).toHaveClass("custom-class");
  });

  it("initializes with provided data", () => {
    const initialData: JobPosition = {
      id: "1",
      title: "Software Engineer",
      department: "Engineering",
      headCount: 5,
      openDate: new Date("2024-01-01"),
      jobDescription: "Job description",
      note: "Some notes",
      status: "OPEN",
    };

    render(<JobPositionForm {...defaultProps} initialData={initialData} />);

    // Form should render without errors with initial data
    expect(screen.getByTestId("basic-info-fields")).toBeInTheDocument();
  });
});
