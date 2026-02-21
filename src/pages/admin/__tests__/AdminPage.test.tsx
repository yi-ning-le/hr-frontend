// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AdminPage } from "../AdminPage";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

vi.mock("@/pages/settings/components/RecruiterManagement", () => ({
  RecruiterManagement: () => (
    <div data-testid="recruiter-management">Recruiter Management</div>
  ),
}));

vi.mock("@/pages/settings/components/InterviewerManagement", () => ({
  InterviewerManagement: () => (
    <div data-testid="interviewer-management">Interviewer Management</div>
  ),
}));

vi.mock("@/pages/settings/components/HRManagement", () => ({
  HRManagement: () => <div data-testid="hr-management">HR Management</div>,
}));

describe("AdminPage", () => {
  it("renders page header and admin tabs", () => {
    render(<AdminPage />);

    expect(screen.getByText("System Administration")).toBeInTheDocument();
    expect(
      screen.getByText("Manage recruitment roles and HR staff."),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Recruiters" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Interviewers" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "HR Management" }),
    ).toBeInTheDocument();
  });

  it("renders recruiters tab by default", () => {
    render(<AdminPage />);
    expect(screen.getByTestId("recruiter-management")).toBeInTheDocument();
  });

  it("respects activeTab prop in controlled mode", () => {
    render(<AdminPage activeTab="interviewers" />);
    expect(screen.getByTestId("interviewer-management")).toBeInTheDocument();
    expect(
      screen.queryByTestId("recruiter-management"),
    ).not.toBeInTheDocument();
  });

  it("calls onTabChange when a different tab is selected", async () => {
    const user = userEvent.setup();
    const handleTabChange = vi.fn();

    render(<AdminPage activeTab="recruiters" onTabChange={handleTabChange} />);

    await user.click(screen.getByRole("tab", { name: "HR Management" }));
    expect(handleTabChange).toHaveBeenCalledWith("hr-management");
  });
});
