import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatsCards } from "../StatsCards";

describe("StatsCards", () => {
  it("renders all four stat cards", () => {
    render(<StatsCards />);

    expect(screen.getByText("员工总数")).toBeInTheDocument();
    expect(screen.getByText("本月入职")).toBeInTheDocument();
    expect(screen.getByText("待审批请假")).toBeInTheDocument();
    expect(screen.getByText("今日出勤率")).toBeInTheDocument();
  });

  it("displays the correct stat values", () => {
    render(<StatsCards />);

    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("96.5%")).toBeInTheDocument();
  });

  it("displays change percentages", () => {
    render(<StatsCards />);

    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(screen.getByText("+8%")).toBeInTheDocument();
    expect(screen.getByText("-3%")).toBeInTheDocument();
    expect(screen.getByText("+2.1%")).toBeInTheDocument();
  });

  it("shows comparison text", () => {
    render(<StatsCards />);

    // Should show "较上月" for all cards
    const comparisonTexts = screen.getAllByText("较上月");
    expect(comparisonTexts).toHaveLength(4);
  });
});
