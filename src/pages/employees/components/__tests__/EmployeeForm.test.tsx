// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Dialog } from "@/components/ui/dialog";
import type { Employee } from "@/types/employee";
import { EmployeeForm } from "../EmployeeForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
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

const renderWithDialog = (ui: React.ReactNode) => {
  return render(<Dialog open={true}>{ui}</Dialog>);
};

describe("EmployeeForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with 'Add Employee' title when no employee prop", () => {
    renderWithDialog(
      <EmployeeForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />,
    );

    expect(screen.getByText("employees.addEmployee")).toBeInTheDocument();
    expect(screen.getByText("common.add")).toBeInTheDocument();
  });

  it("renders form with 'Edit Employee' title when employee prop is provided", () => {
    renderWithDialog(
      <EmployeeForm
        employee={mockEmployee}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />,
    );

    expect(screen.getByText("employees.editEmployee")).toBeInTheDocument();
    expect(screen.getByText("common.save")).toBeInTheDocument();
  });

  it("renders all form fields with correct labels", () => {
    renderWithDialog(
      <EmployeeForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />,
    );

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
    expect(screen.getByText("employees.form.status")).toBeInTheDocument();
    expect(
      screen.getByText("employees.form.employmentType"),
    ).toBeInTheDocument();
  });

  it("pre-fills form fields when editing an employee", () => {
    renderWithDialog(
      <EmployeeForm
        employee={mockEmployee}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />,
    );

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("john.doe@example.com"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Engineering")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Software Engineer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderWithDialog(
      <EmployeeForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />,
    );

    await user.click(screen.getByText("common.cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("calls onSubmit with form data when submitted successfully", async () => {
    const user = userEvent.setup();
    renderWithDialog(
      <EmployeeForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />,
    );

    // Fill in required fields
    await user.type(screen.getByLabelText("employees.form.firstName"), "Jane");
    await user.type(screen.getByLabelText("employees.form.lastName"), "Smith");
    await user.type(
      screen.getByLabelText("employees.form.email"),
      "jane.smith@example.com",
    );
    await user.type(
      screen.getByLabelText("employees.form.phone"),
      "0987654321",
    );
    await user.type(screen.getByLabelText("employees.form.department"), "HR");
    await user.type(
      screen.getByLabelText("employees.form.position"),
      "Manager",
    );

    // For date input, direct typing might vary, safely use fireEvent or type carefully
    const dateInput = screen.getByLabelText("employees.form.joinDate");
    fireEvent.change(dateInput, { target: { value: "2024-02-01" } });

    // Submit form - using fireEvent to avoid potential pointer-events issues with Dialog overlay
    const submitBtn = screen.getByText("common.add");
    fireEvent.click(submitBtn);

    // Check if onSubmit was called
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    // Check the data passed to onSubmit
    const submittedData = mockOnSubmit.mock.calls[0][0];
    expect(submittedData).toMatchObject({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "0987654321",
      department: "HR",
      position: "Manager",
      joinDate: "2024-02-01",
      status: "Active", // default
      employmentType: "FullTime", // default
    });
  });

  it("displays validation errors for required fields", async () => {
    renderWithDialog(
      <EmployeeForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />,
    );

    // Verify inputs are empty
    expect(screen.getByLabelText("employees.form.firstName")).toHaveValue("");

    // Submit form directly to ensure handler is called
    // Find form inside the dialog
    const dialog = screen.getByRole("dialog");
    const form = dialog.querySelector("form");
    if (!form) throw new Error("Form not found");

    fireEvent.submit(form);

    // Check for error messages - waiting for one is enough to ensure validation ran
    await waitFor(() => {
      expect(
        screen.getByText("employees.validation.lastNameRequired"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("employees.validation.firstNameRequired"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("employees.validation.departmentRequired"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("employees.validation.positionRequired"),
    ).toBeInTheDocument();
  });

  it("displays validation error for invalid email", async () => {
    const user = userEvent.setup();
    renderWithDialog(
      <EmployeeForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />,
    );

    await user.type(
      screen.getByLabelText("employees.form.email"),
      "invalid-email",
    );

    const dialog = screen.getByRole("dialog");
    const form = dialog.querySelector("form");
    if (!form) throw new Error("Form not found");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText("employees.validation.emailInvalid"),
      ).toBeInTheDocument();
    });
  });

  it("disables submit button when isLoading is true", () => {
    renderWithDialog(
      <EmployeeForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />,
    );

    expect(screen.getByText("common.saving")).toBeDisabled();
  });
});
