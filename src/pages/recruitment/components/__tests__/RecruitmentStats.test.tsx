import { render, screen } from "@testing-library/react";
import { RecruitmentStats } from "../RecruitmentStats";
import { describe, it, expect } from "vitest";

describe("RecruitmentStats", () => {
  it("renders all stats cards correctly", () => {
    render(<RecruitmentStats />);

    expect(screen.getByText("进行中职位")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();

    expect(screen.getByText("活跃候选人")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();

    expect(screen.getByText("今日面试")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("招聘完成率")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("renders trend information", () => {
    render(<RecruitmentStats />);
    expect(screen.getByText("+2 本周")).toBeInTheDocument();
    expect(screen.getByText("+15 本周")).toBeInTheDocument();
    expect(screen.getByText("即将开始")).toBeInTheDocument();
    expect(screen.getByText("+5% 上月")).toBeInTheDocument();
  })
});
