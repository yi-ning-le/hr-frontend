// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Employee } from "@/types/employee";
import { EmployeeFormDialog } from "../EmployeeFormDialog";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock hooks
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

// Mock Child Components
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
}));

vi.mock("../EmployeeForm", () => ({
  EmployeeForm: ({ onSubmit, onCancel, isLoading }: any) => (
    <div data-testid="employee-form">
      <button
        data-testid="submit-btn"
        onClick={() =>
          onSubmit({
            firstName: "John",
            lastName: "Doe",
            joinDate: "2024-01-01", // String date as expected by form
          })
        }
      >
        Submit
      </button>
      <button data-testid="cancel-btn" onClick={onCancel}>
        Cancel
      </button>
      {isLoading && <span data-testid="loading-indicator">Loading...</span>}
    </div>
  ),
}));

vi.mock("../EmployeeCreateSuccess", () => ({
  EmployeeCreateSuccess: ({ onClose, createdPassword }: any) => (
    <div data-testid="employee-create-success">
      <span>Password: {createdPassword}</span>
      <button data-testid="success-done-btn" onClick={onClose}>
        Done
      </button>
    </div>
  ),
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
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders EmployeeForm when open", () => {
    render(<EmployeeFormDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByTestId("employee-form")).toBeInTheDocument();
  });

  it("does not render content when open is false", () => {
    render(<EmployeeFormDialog open={false} onOpenChange={mockOnOpenChange} />);
    expect(screen.queryByTestId("employee-form")).not.toBeInTheDocument();
  });

  it("calls createEmployee and closes dialog on successful add (no password)", async () => {
    const user = userEvent.setup();
    mockCreateEmployee.mockResolvedValue({ temporaryPassword: null });

    render(<EmployeeFormDialog open={true} onOpenChange={mockOnOpenChange} />);

    await user.click(screen.getByTestId("submit-btn"));

    expect(mockCreateEmployee).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "John",
        joinDate: expect.any(Date),
      }),
    );
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls createEmployee and shows success dialog when password returned", async () => {
    const user = userEvent.setup();
    mockCreateEmployee.mockResolvedValue({
      temporaryPassword: "temp-pass-123",
    });

    render(<EmployeeFormDialog open={true} onOpenChange={mockOnOpenChange} />);

    await user.click(screen.getByTestId("submit-btn"));

    expect(mockCreateEmployee).toHaveBeenCalled();

    // Should now show success dialog
    await waitFor(() => {
      expect(screen.getByTestId("employee-create-success")).toBeInTheDocument();
    });
    expect(screen.getByText("Password: temp-pass-123")).toBeInTheDocument();

    // Dialog should NOT close yet
    expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("calls updateEmployee and closes dialog on successful edit", async () => {
    const user = userEvent.setup();
    mockUpdateEmployee.mockResolvedValue({});

    render(
      <EmployeeFormDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        employee={mockEmployee}
      />,
    );

    await user.click(screen.getByTestId("submit-btn"));

    expect(mockUpdateEmployee).toHaveBeenCalledWith({
      id: mockEmployee.id,
      data: expect.objectContaining({
        firstName: "John",
        joinDate: expect.any(Date),
      }),
    });
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when form cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<EmployeeFormDialog open={true} onOpenChange={mockOnOpenChange} />);

    await user.click(screen.getByTestId("cancel-btn"));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes success dialog and parent dialog when done is clicked", async () => {
    const user = userEvent.setup();
    mockCreateEmployee.mockResolvedValue({
      temporaryPassword: "temp-pass-123",
    });

    render(<EmployeeFormDialog open={true} onOpenChange={mockOnOpenChange} />);

    // Trigger success state
    await user.click(screen.getByTestId("submit-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("employee-create-success")).toBeInTheDocument();
    });

    // Click done
    await user.click(screen.getByTestId("success-done-btn"));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
