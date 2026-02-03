import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RecruitmentHeader } from "../RecruitmentHeader";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

describe("RecruitmentHeader", () => {
  it("renders title and subtitle", () => {
    const onAddJob = vi.fn();
    render(<RecruitmentHeader onAddJob={onAddJob} />);

    expect(screen.getByText("recruitment.title")).toBeInTheDocument();
    expect(screen.getByText("recruitment.subtitle")).toBeInTheDocument();
  });

  it("renders 'Add Job' button", () => {
    const onAddJob = vi.fn();
    render(<RecruitmentHeader onAddJob={onAddJob} />);

    expect(screen.getByRole("button", { name: "recruitment.addJob" })).toBeInTheDocument();
  });

  it("calls onAddJob when button is clicked", () => {
    const onAddJob = vi.fn();
    render(<RecruitmentHeader onAddJob={onAddJob} />);

    fireEvent.click(screen.getByRole("button", { name: "recruitment.addJob" }));
    expect(onAddJob).toHaveBeenCalledTimes(1);
  });
});
