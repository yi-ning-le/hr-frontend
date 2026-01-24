import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Home } from "../Home";


describe("Home", () => {
  it("renders the welcome message", () => {
    render(<Home />);

    expect(screen.getByText(/欢迎回来，管理员/)).toBeInTheDocument();
  });

  it("renders all main sections", () => {
    render(<Home />);

    // Stats Cards
    expect(screen.getByText("员工总数")).toBeInTheDocument();

    // Quick Actions
    expect(screen.getByText("快捷操作")).toBeInTheDocument();

    // Recent Activities
    expect(screen.getByText("最近活动")).toBeInTheDocument();

    // Department Stats
    expect(screen.getByText("部门人员分布")).toBeInTheDocument();
  });

  it("displays the current date", () => {
    render(<Home />);

    expect(screen.getByText(/2026年1月24日/)).toBeInTheDocument();
  });
});
