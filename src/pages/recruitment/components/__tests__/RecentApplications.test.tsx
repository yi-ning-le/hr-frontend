import { render, screen } from "@testing-library/react";
import { RecentApplications } from "../overview/RecentApplications";
import { describe, it, expect } from "vitest";

describe("RecentApplications", () => {
  it("renders the list title", () => {
    render(<RecentApplications />);
    expect(screen.getByText("recruitment.overview.recentApplications.title")).toBeInTheDocument();
  });

  it("renders sample applicants", () => {
    render(<RecentApplications />);
    expect(screen.getByText("张伟")).toBeInTheDocument();
    expect(screen.getByText(/recruitment\.overview\.recentApplications\.appliedFor.*高级前端工程师/)).toBeInTheDocument();

    expect(screen.getByText("李娜")).toBeInTheDocument();
    expect(screen.getByText(/recruitment\.overview\.recentApplications\.appliedFor.*产品经理/)).toBeInTheDocument();
  });

  it("renders status badges", () => {
    render(<RecentApplications />);
    expect(screen.getAllByText("recruitment.candidates.statusOptions.new")[0]).toBeInTheDocument();
    expect(screen.getByText("recruitment.candidates.statusOptions.screening")).toBeInTheDocument();
    expect(screen.getByText("recruitment.candidates.statusOptions.interview")).toBeInTheDocument();
  });
});
