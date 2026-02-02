import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatsCards } from "../StatsCards";

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'zh-CN' },
  }),
}));

describe("StatsCards", () => {
  it("renders all four stat cards", () => {
    render(<StatsCards />);

    expect(screen.getByText("home.stats.totalEmployees")).toBeInTheDocument();
    expect(screen.getByText("home.stats.monthlyOnboard")).toBeInTheDocument();
    expect(screen.getByText("home.stats.pendingLeave")).toBeInTheDocument();
    expect(screen.getByText("home.stats.todayAttendance")).toBeInTheDocument();
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

    // Should show translation key for all cards
    const comparisonTexts = screen.getAllByText("common.comparedToLastMonth");
    expect(comparisonTexts).toHaveLength(4);
  });
});
