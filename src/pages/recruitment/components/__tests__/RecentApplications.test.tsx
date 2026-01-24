import { render, screen } from "@testing-library/react";
import { RecentApplications } from "../RecentApplications";
import { describe, it, expect } from "vitest";

describe("RecentApplications", () => {
  it("renders the list title", () => {
    render(<RecentApplications />);
    expect(screen.getByText("最近申请")).toBeInTheDocument();
  });

  it("renders sample applicants", () => {
    render(<RecentApplications />);
    expect(screen.getByText("张伟")).toBeInTheDocument();
    expect(screen.getByText("申请职位: 高级前端工程师")).toBeInTheDocument();

    expect(screen.getByText("李娜")).toBeInTheDocument();
    expect(screen.getByText("申请职位: 产品经理")).toBeInTheDocument();
  });

  it("renders status badges", () => {
    render(<RecentApplications />);
    expect(screen.getAllByText("新申请")[0]).toBeInTheDocument();
    expect(screen.getByText("筛选中")).toBeInTheDocument();
    expect(screen.getByText("面试中")).toBeInTheDocument();
  });
});
