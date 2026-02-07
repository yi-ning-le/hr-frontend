// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EmployeeFormDialog } from "../EmployeeFormDialog";
import type { Employee } from "@/types/employee";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock useCreateEmployee and useUpdateEmployee hooks
const mockCreateEmployee = vi.fn();
const mockUpdateEmployee = vi.fn();
vi.mock("@/hooks/queries/useEmployees", () => ({
  useCreateEmployee: () => ({
    mutateAsync: mockCreateEmployee,
    isPending: false,
  }),
  useUpdateEmployee: () => ({
    mutateAsync: mockUpdateEmployee,
    isPending: false,
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

describe("EmployeeFormDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dialog with 'Add Employee' title when no employee prop", async () => {
    render(<EmployeeFormDialog open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByText("employees.addEmployee")).toBeInTheDocument();
  });

  it("renders dialog with 'Edit Employee' title when employee prop is provided", () => {
    render(
      <EmployeeFormDialog
        open={true}
        onOpenChange={vi.fn()}
        employee={mockEmployee}
      />,
    );

    expect(screen.getByText("employees.editEmployee")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<EmployeeFormDialog open={true} onOpenChange={vi.fn()} />);

    expect(
      screen.getByLabelText("employees.form.firstName"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("employees.form.lastName"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("employees.form.email")).toBeInTheDocument();
    expect(screen.getByLabelText("employees.form.phone")).toBeInTheDocument();
    expect(
      screen.getByLabelText("employees.form.department"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("employees.form.position"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("employees.form.joinDate"),
    ).toBeInTheDocument();
  });

  it("renders status and employment type select fields", () => {
    render(<EmployeeFormDialog open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByText("employees.form.status")).toBeInTheDocument();
    expect(
      screen.getByText("employees.form.employmentType"),
    ).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnOpenChange = vi.fn();
    render(<EmployeeFormDialog open={true} onOpenChange={mockOnOpenChange} />);

    const cancelButton = screen.getByText("common.cancel");
    await user.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders submit button with correct text for add mode", () => {
    render(<EmployeeFormDialog open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByText("common.add")).toBeInTheDocument();
  });

  it("renders submit button with correct text for edit mode", () => {
    render(
      <EmployeeFormDialog
        open={true}
        onOpenChange={vi.fn()}
        employee={mockEmployee}
      />,
    );

    expect(screen.getByText("common.save")).toBeInTheDocument();
  });

  it("does not render dialog content when open is false", () => {
    render(<EmployeeFormDialog open={false} onOpenChange={vi.fn()} />);

    expect(screen.queryByText("employees.addEmployee")).not.toBeInTheDocument();
  });
});
