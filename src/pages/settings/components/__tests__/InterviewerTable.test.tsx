// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Recruiter } from "@/lib/api";
import { InterviewerTable } from "../InterviewerTable";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue || key,
  }),
}));

const mockInterviewers: Recruiter[] = [
  {
    employeeId: "emp1",
    firstName: "John",
    lastName: "Doe",
    department: "Engineering",
  },
  {
    employeeId: "emp2",
    firstName: "Jane",
    lastName: "Smith",
    department: "HR",
  },
];

describe("InterviewerTable", () => {
  it("renders the table with interviewer data", () => {
    render(
      <InterviewerTable
        interviewers={mockInterviewers}
        isLoading={false}
        onRevoke={() => {}}
        isRevoking={false}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("HR")).toBeInTheDocument();
    const badges = screen.getAllByText("Interviewer");
    expect(badges).toHaveLength(2);
  });

  it("shows loading state", () => {
    const { container } = render(
      <InterviewerTable
        interviewers={[]}
        isLoading={true}
        onRevoke={() => {}}
        isRevoking={false}
      />,
    );

    const loader = container.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("shows empty state when no interviewers", () => {
    render(
      <InterviewerTable
        interviewers={[]}
        isLoading={false}
        onRevoke={() => {}}
        isRevoking={false}
      />,
    );

    expect(
      screen.getByText("No interviewers assigned yet."),
    ).toBeInTheDocument();
  });

  it("calls onRevoke when revoke button is clicked", async () => {
    const onRevoke = vi.fn();
    const user = userEvent.setup();

    render(
      <InterviewerTable
        interviewers={mockInterviewers}
        isLoading={false}
        onRevoke={onRevoke}
        isRevoking={false}
      />,
    );

    const revokeButtons = screen.getAllByRole("button");
    await user.click(revokeButtons[0]);

    expect(onRevoke).toHaveBeenCalledWith("emp1");
  });

  it("disables buttons when isRevoking is true", () => {
    render(
      <InterviewerTable
        interviewers={mockInterviewers}
        isLoading={false}
        onRevoke={() => {}}
        isRevoking={true}
      />,
    );

    const revokeButtons = screen.getAllByRole("button");
    revokeButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("renders table headers correctly", () => {
    render(
      <InterviewerTable
        interviewers={mockInterviewers}
        isLoading={false}
        onRevoke={() => {}}
        isRevoking={false}
      />,
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});
