
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RecruitmentStats } from "../RecruitmentStats";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("RecruitmentStats", () => {
  it("renders stats cards correctly", () => {
    render(<RecruitmentStats />);

    // Check titles
    expect(screen.getByText("recruitment.stats.activeJobs")).toBeInTheDocument();
    expect(screen.getByText("recruitment.stats.activeCandidates")).toBeInTheDocument();
    expect(screen.getByText("recruitment.stats.todayInterviews")).toBeInTheDocument();
    expect(screen.getByText("recruitment.stats.completionRate")).toBeInTheDocument();

    // Check values (hardcoded in component currently)
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("renders trend indicators", () => {
    render(<RecruitmentStats />);

    expect(screen.getByText(/\+2/)).toBeInTheDocument();
    expect(screen.getByText(/\+15/)).toBeInTheDocument();
    // For today's interviews, the trend value might be empty string or different based on logic,
    // but we can check the label key
    expect(screen.getByText("recruitment.stats.upcoming")).toBeInTheDocument();
  });
});
