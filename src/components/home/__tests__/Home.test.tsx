import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Home } from "../Home";

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'zh-CN',
    },
  }),
}));

describe("Home", () => {
  it("renders the welcome message", () => {
    render(<Home />);

    expect(screen.getByText("home.welcome")).toBeInTheDocument();
  });

  it("renders all main sections", () => {
    render(<Home />);

    // Stats Cards
    expect(screen.getByText("home.stats.totalEmployees")).toBeInTheDocument();

    // Quick Actions
    expect(screen.getByText("home.quickActions.title")).toBeInTheDocument();

    // Recent Activities
    expect(screen.getByText("home.recentActivities.title")).toBeInTheDocument();

    // Department Stats
    expect(screen.getByText("home.departmentStats.title")).toBeInTheDocument();
  });

  it("displays the today info message", () => {
    render(<Home />);

    // The translation key should be present with the date parameter
    expect(screen.getByText(/home\.todayInfo/)).toBeInTheDocument();
  });
});
