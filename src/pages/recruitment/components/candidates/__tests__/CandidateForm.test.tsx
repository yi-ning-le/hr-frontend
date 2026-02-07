// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CandidateForm } from "../CandidateForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

vi.mock("@/hooks/useCandidateStatuses", () => ({
  useCandidateStatuses: () => ({
    statuses: [
      { id: "1", slug: "new", name: "New", type: "system", color: "#000000" },
      {
        id: "2",
        slug: "interview",
        name: "Interview",
        type: "system",
        color: "#00FF00",
      },
    ],
    statusMap: {
      new: {
        id: "1",
        slug: "new",
        name: "New",
        type: "system",
        color: "#000000",
      },
      interview: {
        id: "2",
        slug: "interview",
        name: "Interview",
        type: "system",
        color: "#00FF00",
      },
    },
  }),
}));

// Mock useJobs hook
vi.mock("@/hooks/queries/useJobs", () => ({
  useJobs: () => ({
    data: [
      {
        id: "j1",
        title: "Job 1",
        department: "Dept 1",
        status: "OPEN",
        headCount: 1,
        openDate: new Date(),
        jobDescription: "Test",
      },
      {
        id: "j2",
        title: "Job 2",
        department: "Dept 2",
        status: "OPEN",
        headCount: 1,
        openDate: new Date(),
        jobDescription: "Test",
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

describe("CandidateForm", () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  it("renders all form fields", () => {
    render(<CandidateForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    // Use the actual translation keys from the component
    expect(screen.getByText("recruitment.candidates.name")).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.email"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.phone"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.channel"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.position"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.education"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.experienceYears"),
    ).toBeInTheDocument();
  });

  it("calls onCancel when cancel button clicked", () => {
    render(<CandidateForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "common.cancel" }));
    expect(mockCancel).toHaveBeenCalled();
  });

  it("renders submit button with default label", () => {
    render(<CandidateForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    expect(
      screen.getByRole("button", { name: "common.save" }),
    ).toBeInTheDocument();
  });

  it("renders submit button with custom label", () => {
    render(
      <CandidateForm
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        submitLabel="Custom Submit"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Custom Submit" }),
    ).toBeInTheDocument();
  });
});
