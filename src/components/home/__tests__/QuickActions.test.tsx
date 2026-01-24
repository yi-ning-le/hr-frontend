import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuickActions } from "../QuickActions";

describe("QuickActions", () => {
  it("renders the section title", () => {
    render(<QuickActions />);

    expect(screen.getByText("快捷操作")).toBeInTheDocument();
    expect(screen.getByText("常用功能的快速入口")).toBeInTheDocument();
  });

  it("renders all six quick action buttons", () => {
    render(<QuickActions />);

    expect(screen.getByText("员工管理")).toBeInTheDocument();
    expect(screen.getByText("考勤管理")).toBeInTheDocument();
    expect(screen.getByText("请假审批")).toBeInTheDocument();
    expect(screen.getByText("绩效考核")).toBeInTheDocument();
    expect(screen.getByText("部门管理")).toBeInTheDocument();
    expect(screen.getByText("数据分析")).toBeInTheDocument();
  });

  it("renders action descriptions", () => {
    render(<QuickActions />);

    expect(screen.getByText("查看和管理员工信息")).toBeInTheDocument();
    expect(screen.getByText("考勤记录与统计")).toBeInTheDocument();
    expect(screen.getByText("处理员工请假申请")).toBeInTheDocument();
    expect(screen.getByText("员工绩效评估")).toBeInTheDocument();
    expect(screen.getByText("组织架构管理")).toBeInTheDocument();
    expect(screen.getByText("人力资源报表")).toBeInTheDocument();
  });
});
