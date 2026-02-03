import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { JobBasicInfoFields } from "../JobBasicInfoFields";
import type { JobFormValues } from "../JobPositionForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Render helper that uses the wrapper's control
function RenderableJobBasicInfoFields() {
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
      <JobBasicInfoFields control={form.control} />
    </FormProvider>
  );
}

describe("JobBasicInfoFields", () => {
  it("renders title field with label", () => {
    render(<RenderableJobBasicInfoFields />);

    expect(screen.getByText("recruitment.jobs.form.titleLabel")).toBeInTheDocument();
  });

  it("renders department field with label", () => {
    render(<RenderableJobBasicInfoFields />);

    expect(screen.getByText("recruitment.jobs.form.departmentLabel")).toBeInTheDocument();
  });

  it("renders headCount field with label", () => {
    render(<RenderableJobBasicInfoFields />);

    expect(screen.getByText("recruitment.jobs.form.headCountLabel")).toBeInTheDocument();
  });

  it("renders input with placeholder text", () => {
    render(<RenderableJobBasicInfoFields />);

    expect(screen.getByPlaceholderText("recruitment.jobs.form.titlePlaceholder")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("recruitment.jobs.form.departmentPlaceholder")).toBeInTheDocument();
  });
});
