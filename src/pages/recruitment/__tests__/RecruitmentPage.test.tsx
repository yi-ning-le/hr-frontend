import { render, screen } from "@testing-library/react";
import { RecruitmentPage } from "../RecruitmentPage";
import { describe, it, expect, vi } from "vitest";

// Mock subcomponents
vi.mock("../components/RecruitmentStats", () => ({
  RecruitmentStats: () => <div data-testid="recruitment-stats">Stats Component</div>,
}));

vi.mock("../components/RecentApplications", () => ({
  RecentApplications: () => <div data-testid="recent-applications">Applications Component</div>,
}));

describe("RecruitmentPage", () => {
  it("renders header title", () => {
    render(<RecruitmentPage />);
    expect(screen.getByText("招聘管理")).toBeInTheDocument();
    expect(screen.getByText("管理职位发布、候选人跟进及招聘数据分析")).toBeInTheDocument();
  });

  it("renders tabs", () => {
    render(<RecruitmentPage />);
    expect(screen.getByText("概览")).toBeInTheDocument();
    expect(screen.getByText("职位管理")).toBeInTheDocument();
    expect(screen.getByText("候选人")).toBeInTheDocument();
    expect(screen.getByText("面试日程")).toBeInTheDocument();
  });

  it("renders statistics and applications widgets in overview tab", () => {
    render(<RecruitmentPage />);
    // By default, Tabs renders the default content
    expect(screen.getByTestId("recruitment-stats")).toBeInTheDocument();
    expect(screen.getByTestId("recent-applications")).toBeInTheDocument();
  });
});
