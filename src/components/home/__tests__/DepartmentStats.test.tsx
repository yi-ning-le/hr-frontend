import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DepartmentStats } from "../DepartmentStats";

describe("DepartmentStats", () => {
  it("renders the section title", () => {
    render(<DepartmentStats />);

    expect(screen.getByText("部门人员分布")).toBeInTheDocument();
    expect(screen.getByText("各部门员工数量及占比")).toBeInTheDocument();
  });

  it("renders all department names", () => {
    render(<DepartmentStats />);

    expect(screen.getByText("技术部")).toBeInTheDocument();
    expect(screen.getByText("产品部")).toBeInTheDocument();
    expect(screen.getByText("市场部")).toBeInTheDocument();
    expect(screen.getByText("运营部")).toBeInTheDocument();
    expect(screen.getByText("人事部")).toBeInTheDocument();
  });

  it("renders department employee counts", () => {
    render(<DepartmentStats />);

    expect(screen.getByText("156人")).toBeInTheDocument();
    expect(screen.getByText("89人")).toBeInTheDocument();
    expect(screen.getByText("67人")).toBeInTheDocument();
    expect(screen.getByText("78人")).toBeInTheDocument();
    expect(screen.getByText("58人")).toBeInTheDocument();
  });

  it("renders department percentages", () => {
    render(<DepartmentStats />);

    expect(screen.getByText("占比 35%")).toBeInTheDocument();
    expect(screen.getByText("占比 20%")).toBeInTheDocument();
    expect(screen.getByText("占比 15%")).toBeInTheDocument();
    expect(screen.getByText("占比 17%")).toBeInTheDocument();
    expect(screen.getByText("占比 13%")).toBeInTheDocument();
  });
});
