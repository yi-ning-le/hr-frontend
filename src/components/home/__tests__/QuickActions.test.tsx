import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuickActions } from "../QuickActions";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN" },
  }),
}));

describe("QuickActions", () => {
  it("renders the section title", () => {
    render(<QuickActions />);

    expect(screen.getByText("home.quickActions.title")).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.description"),
    ).toBeInTheDocument();
  });

  it("renders all six quick action buttons", () => {
    render(<QuickActions />);

    expect(
      screen.getByText("home.quickActions.employeeManagement"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.attendanceManagement"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.leaveApproval"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.performance"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.departmentManagement"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.dataAnalysis"),
    ).toBeInTheDocument();
  });

  it("renders action descriptions", () => {
    render(<QuickActions />);

    expect(
      screen.getByText("home.quickActions.employeeManagementDesc"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.attendanceManagementDesc"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.leaveApprovalDesc"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.performanceDesc"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.departmentManagementDesc"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.quickActions.dataAnalysisDesc"),
    ).toBeInTheDocument();
  });
});
