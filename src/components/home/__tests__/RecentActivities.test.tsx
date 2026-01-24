import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RecentActivities } from "../RecentActivities";

describe("RecentActivities", () => {
  it("renders the section title", () => {
    render(<RecentActivities />);

    expect(screen.getByText("最近活动")).toBeInTheDocument();
    expect(screen.getByText("员工动态更新")).toBeInTheDocument();
  });

  it("renders the view all button", () => {
    render(<RecentActivities />);

    expect(screen.getByText("查看全部")).toBeInTheDocument();
  });

  it("renders all activity items with user names", () => {
    render(<RecentActivities />);

    expect(screen.getByText("张三")).toBeInTheDocument();
    expect(screen.getByText("李四")).toBeInTheDocument();
    expect(screen.getByText("王五")).toBeInTheDocument();
    expect(screen.getByText("赵六")).toBeInTheDocument();
  });

  it("renders activity actions", () => {
    render(<RecentActivities />);

    expect(screen.getByText("提交了年假申请")).toBeInTheDocument();
    expect(screen.getByText("完成了入职手续")).toBeInTheDocument();
    expect(screen.getByText("更新了个人信息")).toBeInTheDocument();
    expect(screen.getByText("提交了报销申请")).toBeInTheDocument();
  });

  it("renders activity timestamps", () => {
    render(<RecentActivities />);

    expect(screen.getByText("5分钟前")).toBeInTheDocument();
    expect(screen.getByText("30分钟前")).toBeInTheDocument();
    expect(screen.getByText("1小时前")).toBeInTheDocument();
    expect(screen.getByText("2小时前")).toBeInTheDocument();
  });

  it("renders activity type badges", () => {
    render(<RecentActivities />);

    expect(screen.getByText("请假")).toBeInTheDocument();
    expect(screen.getByText("入职")).toBeInTheDocument();
    expect(screen.getByText("更新")).toBeInTheDocument();
    expect(screen.getByText("报销")).toBeInTheDocument();
  });
});
