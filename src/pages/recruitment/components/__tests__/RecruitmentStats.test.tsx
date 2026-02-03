import { render, screen } from "@testing-library/react";
import { RecruitmentStats } from "../overview/RecruitmentStats";
import { describe, it, expect } from "vitest";

describe("RecruitmentStats", () => {
  it("renders all stats cards correctly", () => {
    render(<RecruitmentStats />);

    expect(screen.getByText("recruitment.stats.activeJobs")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();

    expect(screen.getByText("recruitment.stats.activeCandidates")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();

    expect(screen.getByText("recruitment.stats.todayInterviews")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("recruitment.stats.completionRate")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("renders trend information", () => {
    render(<RecruitmentStats />);
    expect(screen.getByText("+2 recruitment.stats.thisWeek")).toBeInTheDocument();
    expect(screen.getByText("+15 recruitment.stats.thisWeek")).toBeInTheDocument();
    expect(screen.getByText("recruitment.stats.upcoming")).toBeInTheDocument();
    expect(screen.getByText("+5% recruitment.stats.lastMonth")).toBeInTheDocument();
  })
});
