import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DepartmentStats } from "../DepartmentStats";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN" },
  }),
}));

describe("DepartmentStats", () => {
  it("renders the section title", () => {
    render(<DepartmentStats />);

    expect(screen.getByText("home.departmentStats.title")).toBeInTheDocument();
    expect(
      screen.getByText("home.departmentStats.description"),
    ).toBeInTheDocument();
  });

  it("renders all department names", () => {
    render(<DepartmentStats />);

    expect(
      screen.getByText("home.departmentStats.departments.tech"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.departmentStats.departments.product"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.departmentStats.departments.marketing"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.departmentStats.departments.operations"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.departmentStats.departments.hr"),
    ).toBeInTheDocument();
  });

  it("renders department employee counts", () => {
    render(<DepartmentStats />);

    expect(screen.getByText("156common.people")).toBeInTheDocument();
    expect(screen.getByText("89common.people")).toBeInTheDocument();
    expect(screen.getByText("67common.people")).toBeInTheDocument();
    expect(screen.getByText("78common.people")).toBeInTheDocument();
    expect(screen.getByText("58common.people")).toBeInTheDocument();
  });

  it("renders department percentages", () => {
    render(<DepartmentStats />);

    expect(screen.getByText("common.percentage 35%")).toBeInTheDocument();
    expect(screen.getByText("common.percentage 20%")).toBeInTheDocument();
    expect(screen.getByText("common.percentage 15%")).toBeInTheDocument();
    expect(screen.getByText("common.percentage 17%")).toBeInTheDocument();
    expect(screen.getByText("common.percentage 13%")).toBeInTheDocument();
  });
});
