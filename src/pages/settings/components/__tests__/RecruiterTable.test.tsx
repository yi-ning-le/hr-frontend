// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Recruiter } from "@/lib/api";
import { RecruiterTable } from "../RecruiterTable";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue || key,
  }),
}));

const mockRecruiters: Recruiter[] = [
  {
    employeeId: "emp1",
    firstName: "John",
    lastName: "Doe",
    department: "HR",
  },
  {
    employeeId: "emp2",
    firstName: "Jane",
    lastName: "Smith",
    department: "Engineering",
  },
];

describe("RecruiterTable", () => {
  it("renders the table with recruiter data", () => {
    render(
      <RecruiterTable
        recruiters={mockRecruiters}
        isLoading={false}
        onRevoke={() => {}}
        isRevoking={false}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    // Check for recruiter badges
    const badges = screen.getAllByText("Recruiter");
    expect(badges).toHaveLength(2);
  });

  it("shows loading state", () => {
    const { container } = render(
      <RecruiterTable
        recruiters={[]}
        isLoading={true}
        onRevoke={() => {}}
        isRevoking={false}
      />,
    );

    const loader = container.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("shows empty state when no recruiters", () => {
    render(
      <RecruiterTable
        recruiters={[]}
        isLoading={false}
        onRevoke={() => {}}
        isRevoking={false}
      />,
    );

    expect(screen.getByText("No recruiters assigned yet.")).toBeInTheDocument();
  });

  it("calls onRevoke when revoke button is clicked", async () => {
    const onRevoke = vi.fn();
    const user = userEvent.setup();

    render(
      <RecruiterTable
        recruiters={mockRecruiters}
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
      <RecruiterTable
        recruiters={mockRecruiters}
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
});
