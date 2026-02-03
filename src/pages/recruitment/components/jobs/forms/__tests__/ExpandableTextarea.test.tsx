import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { ExpandableTextarea } from "../ExpandableTextarea";
import type { JobFormValues } from "../JobPositionForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      if (params?.title) return `Edit ${params.title}`;
      return key;
    },
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

interface TestProps {
  value?: string;
  onChange?: (value: string) => void;
  title?: string;
  placeholder?: string;
}

function RenderableExpandableTextarea({
  value = "test content",
  onChange = vi.fn(),
  title = "Job Description",
  placeholder = "Enter description...",
}: TestProps = {}) {
  const form = useForm<JobFormValues>({
    defaultValues: {
      title: "",
      department: "",
      headCount: 1,
      openDate: new Date(),
      jobDescription: value,
      note: "",
      status: "OPEN",
    },
  });

  return (
    <FormProvider {...form}>
      <ExpandableTextarea
        value={value}
        onChange={onChange}
        title={title}
        placeholder={placeholder}
      />
    </FormProvider>
  );
}

describe("ExpandableTextarea", () => {
  it("renders with title and expand button", () => {
    render(<RenderableExpandableTextarea />);

    expect(screen.getByText("Job Description")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders textarea with value and placeholder", () => {
    render(<RenderableExpandableTextarea />);

    const textarea = screen.getByPlaceholderText("Enter description...");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("test content");
  });

  it("calls onChange when typing in textarea", () => {
    const onChange = vi.fn();
    render(<RenderableExpandableTextarea onChange={onChange} />);

    const textarea = screen.getByPlaceholderText("Enter description...");
    fireEvent.change(textarea, { target: { value: "new content" } });

    expect(onChange).toHaveBeenCalledWith("new content");
  });

  it("opens fullscreen dialog when expand button clicked", () => {
    render(<RenderableExpandableTextarea />);

    const expandButton = screen.getByRole("button");
    fireEvent.click(expandButton);

    expect(screen.getByText("Edit Job Description")).toBeInTheDocument();
  });

  it("closes dialog when done button clicked", () => {
    render(<RenderableExpandableTextarea />);

    // Open dialog
    const expandButton = screen.getByRole("button");
    fireEvent.click(expandButton);

    // Find and click done button
    const doneButton = screen.getByText("recruitment.jobs.form.expandableTextarea.done");
    fireEvent.click(doneButton);

    // Dialog should be closed - the dialog title should not be visible
    expect(screen.queryByText("Edit Job Description")).not.toBeInTheDocument();
  });
});
