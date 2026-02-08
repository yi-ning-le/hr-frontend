import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OverviewTab } from "../OverviewTab";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock child components
vi.mock("../RecruitmentStats", () => ({
  RecruitmentStats: () => (
    <div data-testid="recruitment-stats">RecruitmentStats</div>
  ),
}));

vi.mock("../RecentApplications", () => ({
  RecentApplications: () => (
    <div data-testid="recent-applications">RecentApplications</div>
  ),
}));

describe("OverviewTab", () => {
  it("renders RecruitmentStats component", () => {
    render(<OverviewTab />);

    expect(screen.getByTestId("recruitment-stats")).toBeInTheDocument();
  });

  it("renders RecentApplications component", () => {
    render(<OverviewTab />);

    expect(screen.getByTestId("recent-applications")).toBeInTheDocument();
  });

  it("renders recruitment funnel section", () => {
    render(<OverviewTab />);

    expect(
      screen.getByText("recruitment.overview.funnel.title"),
    ).toBeInTheDocument();
  });

  it("renders funnel stages", () => {
    render(<OverviewTab />);

    expect(
      screen.getByText("recruitment.overview.funnel.screening"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.overview.funnel.firstInterview"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.overview.funnel.secondInterview"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.overview.funnel.offer"),
    ).toBeInTheDocument();
  });

  it("renders funnel stage counts", () => {
    render(<OverviewTab />);

    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
