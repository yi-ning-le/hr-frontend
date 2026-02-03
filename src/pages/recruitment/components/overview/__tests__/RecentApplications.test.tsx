
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RecentApplications } from "../RecentApplications";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("RecentApplications", () => {
  it("renders recent applications list", () => {
    render(<RecentApplications />);

    expect(screen.getByText("recruitment.overview.recentApplications.title")).toBeInTheDocument();

    // Check for some static mock data that is hardcoded in the component
    expect(screen.getByText("张伟")).toBeInTheDocument();
    expect(screen.getByText("李娜")).toBeInTheDocument();

    // Check status rendering
    expect(screen.getAllByText("recruitment.candidates.statusOptions.new").length).toBeGreaterThan(0);
  });

  it("renders correct roles", () => {
    render(<RecentApplications />);

    expect(screen.getByText(/高级前端工程师/)).toBeInTheDocument();
    expect(screen.getByText(/产品经理/)).toBeInTheDocument();
  });
});
