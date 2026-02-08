import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecentActivities } from "../RecentActivities";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN" },
  }),
}));

describe("RecentActivities", () => {
  it("renders the section title", () => {
    render(<RecentActivities />);

    expect(screen.getByText("home.recentActivities.title")).toBeInTheDocument();
    expect(
      screen.getByText("home.recentActivities.description"),
    ).toBeInTheDocument();
  });

  it("renders the view all button", () => {
    render(<RecentActivities />);

    expect(screen.getByText("common.viewAll")).toBeInTheDocument();
  });

  it("renders all activity items with user names", () => {
    render(<RecentActivities />);

    expect(screen.getByText("张三")).toBeInTheDocument();
    expect(screen.getByText("李四")).toBeInTheDocument();
    expect(screen.getByText("王五")).toBeInTheDocument();
    expect(screen.getByText("赵六")).toBeInTheDocument();
  });

  it("renders activity actions (Chinese as mock returns zh-CN)", () => {
    render(<RecentActivities />);

    expect(screen.getByText("提交了年假申请")).toBeInTheDocument();
    expect(screen.getByText("完成了入职手续")).toBeInTheDocument();
    expect(screen.getByText("更新了个人信息")).toBeInTheDocument();
    expect(screen.getByText("提交了报销申请")).toBeInTheDocument();
  });

  it("renders activity timestamps (Chinese as mock returns zh-CN)", () => {
    render(<RecentActivities />);

    expect(screen.getByText("5分钟前")).toBeInTheDocument();
    expect(screen.getByText("30分钟前")).toBeInTheDocument();
    expect(screen.getByText("1小时前")).toBeInTheDocument();
    expect(screen.getByText("2小时前")).toBeInTheDocument();
  });

  it("renders activity type badges with translation keys", () => {
    render(<RecentActivities />);

    expect(
      screen.getByText("home.recentActivities.activityTypes.leave"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.recentActivities.activityTypes.onboard"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.recentActivities.activityTypes.update"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.recentActivities.activityTypes.expense"),
    ).toBeInTheDocument();
  });
});
