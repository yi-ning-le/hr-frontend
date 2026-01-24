import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "../Header";

describe("Header", () => {
  it("renders the HR System title", () => {
    render(<Header />);

    expect(screen.getByText("HR System")).toBeInTheDocument();
    expect(screen.getByText("人力资源管理系统")).toBeInTheDocument();
  });

  it("renders the notification bell with badge", () => {
    render(<Header />);

    // The badge shows "3" notifications
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders the user avatar with fallback", () => {
    render(<Header />);

    expect(screen.getByText("管")).toBeInTheDocument();
  });
});
