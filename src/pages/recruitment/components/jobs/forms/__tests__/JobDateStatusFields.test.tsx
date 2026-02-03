import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { JobDateStatusFields } from "../JobDateStatusFields";
import type { JobFormValues } from "../JobPositionForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Render helper that uses the wrapper's control
function RenderableJobDateStatusFields({ withDate = true }: { withDate?: boolean }) {
  const form = useForm<JobFormValues>({
    defaultValues: {
      title: "",
      department: "",
      headCount: 1,
      openDate: withDate ? new Date() : undefined,
      jobDescription: "",
      note: "",
      status: "OPEN",
    },
  });

  return (
    <FormProvider {...form}>
      <JobDateStatusFields control={form.control} />
    </FormProvider>
  );
}

describe("JobDateStatusFields", () => {
  it("renders open date field with label", () => {
    render(<RenderableJobDateStatusFields />);

    expect(screen.getByText("recruitment.jobs.form.openDateLabel")).toBeInTheDocument();
  });

  it("renders status field with label", () => {
    render(<RenderableJobDateStatusFields />);

    expect(screen.getByText("recruitment.jobs.form.statusLabel")).toBeInTheDocument();
  });

  it("renders date picker trigger button when no date", () => {
    render(<RenderableJobDateStatusFields withDate={false} />);

    expect(screen.getByText("recruitment.jobs.form.selectDate")).toBeInTheDocument();
  });

  it("renders status select with trigger", () => {
    render(<RenderableJobDateStatusFields />);

    // Select trigger should be present
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
