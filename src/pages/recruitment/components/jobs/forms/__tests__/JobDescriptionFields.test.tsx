import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { JobDescriptionFields } from "../JobDescriptionFields";
import type { JobFormValues } from "../JobPositionForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Render helper that uses the wrapper's control
function RenderableJobDescriptionFields() {
  const form = useForm<JobFormValues>({
    defaultValues: {
      title: "",
      department: "",
      headCount: 1,
      openDate: new Date(),
      jobDescription: "",
      note: "",
      status: "OPEN",
    },
  });

  return (
    <FormProvider {...form}>
      <JobDescriptionFields control={form.control} />
    </FormProvider>
  );
}

describe("JobDescriptionFields", () => {
  it("renders job description field", () => {
    render(<RenderableJobDescriptionFields />);

    expect(
      screen.getByText("recruitment.jobs.form.jdLabel"),
    ).toBeInTheDocument();
  });

  it("renders note field", () => {
    render(<RenderableJobDescriptionFields />);

    expect(
      screen.getByText("recruitment.jobs.form.noteLabel"),
    ).toBeInTheDocument();
  });

  it("renders both textareas", () => {
    render(<RenderableJobDescriptionFields />);

    const textareas = screen.getAllByRole("textbox");
    expect(textareas).toHaveLength(2);
  });
});
