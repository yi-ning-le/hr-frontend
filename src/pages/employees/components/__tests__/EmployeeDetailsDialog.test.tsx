// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Employee } from "@/types/employee";
import { EmployeeDetailsDialog } from "../EmployeeDetailsDialog";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, value: string) => value || key,
  }),
}));

const mockEmployee: Employee = {
  id: "emp-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "1234567890",
  department: "Engineering",
  position: "Software Engineer",
  status: "Active",
  employmentType: "FullTime",
  joinDate: new Date("2024-01-15"),
};

describe("EmployeeDetailsDialog", () => {
  it("renders nothing when no employee is provided", () => {
    const { container } = render(
      <EmployeeDetailsDialog open={true} onOpenChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders employee details correctly", () => {
    render(
      <EmployeeDetailsDialog
        open={true}
        onOpenChange={vi.fn()}
        employee={mockEmployee}
      />,
    );

    expect(screen.getByText("Employee Details")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    // Status and Type are transformed by t(), our mock returns value or key
    // Since we mock t((k, v) => v), it returns "Active" for status
  });

  it("calls onOpenChange(false) when close button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnOpenChange = vi.fn();
    render(
      <EmployeeDetailsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        employee={mockEmployee}
      />,
    );

    const closeButton = screen.getByText("Close", { selector: "button" });
    await user.click(closeButton);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
