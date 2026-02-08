// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEmployees } from "@/hooks/queries/useEmployees";
import type { Employee } from "@/types/employee";
import { EmployeesPage } from "../EmployeesPage";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock useEmployeeStore for filters and pagination
vi.mock("@/stores/useEmployeeStore", () => ({
  useEmployeeStore: vi.fn(() => ({
    filters: { search: "", status: "" },
    pagination: { page: 1, limit: 10, total: 0 },
    setFilters: vi.fn(),
    setPage: vi.fn(),
  })),
}));

// Mock TanStack Query hooks
const mockDeleteEmployee = vi.fn();
vi.mock("@/hooks/queries/useEmployees", () => ({
  useEmployees: vi.fn(() => ({
    data: { employees: [], total: 0 },
    isLoading: false,
    isError: false,
  })),
  useDeleteEmployee: vi.fn(() => ({
    mutateAsync: mockDeleteEmployee,
    isPending: false,
  })),
}));

// Mock useUserRole hook - default to HR for backward compatibility with existing tests
vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: vi.fn(() => ({
    isAdmin: false,
    isRecruiter: false,
    isInterviewer: false,
    isHR: true, // Default to HR for existing tests
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

import { useUserRole } from "@/hooks/useUserRole";

// Mock child components
vi.mock("../components/EmployeeList", () => ({
  EmployeeList: ({
    employees,
    onEdit,
    onDelete,
    onView,
    isLoading,
  }: {
    employees: Employee[];
    onEdit: (e: Employee) => void;
    onDelete: (e: Employee) => void;
    onView: (e: Employee) => void;
    isLoading?: boolean;
  }) => (
    <div data-testid="employee-list">
      {isLoading && <div data-testid="loading-indicator">Loading...</div>}
      {employees?.map((e: Employee) => (
        <div key={e.id}>
          <span onClick={() => onView?.(e)}>
            {e.firstName} {e.lastName}
          </span>
          <button onClick={() => onEdit?.(e)}>Edit Item</button>
          <button onClick={() => onDelete?.(e)}>Delete Item</button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../components/EmployeeFormDialog", () => ({
  EmployeeFormDialog: ({
    open,
    employee,
    readOnly,
  }: {
    open: boolean;
    employee?: Employee;
    readOnly?: boolean;
  }) =>
    open ? (
      <div data-testid="employee-form-dialog">
        {readOnly
          ? "View Employee"
          : employee
            ? `Edit ${employee.firstName}`
            : "Add Employee"}
      </div>
    ) : null,
}));

// Mock AlertDialog
vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    open,
    children,
  }: {
    open: boolean;
    children: React.ReactNode;
  }) => (open ? <div role="alertdialog">{children}</div> : null),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogAction: ({
    onClick,
    children,
  }: {
    onClick: () => void;
    children: React.ReactNode;
  }) => <button onClick={onClick}>{children}</button>,
  AlertDialogCancel: ({
    onClick,
    children,
  }: {
    onClick: () => void;
    children: React.ReactNode;
  }) => <button onClick={onClick}>{children}</button>,
}));

describe("EmployeesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page header and add button", () => {
    render(<EmployeesPage />);
    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("Add Employee")).toBeInTheDocument();
  });

  it("opens dialog when Add Employee button is clicked", async () => {
    const user = userEvent.setup();
    render(<EmployeesPage />);
    await user.click(screen.getByText("Add Employee"));
    expect(screen.getByTestId("employee-form-dialog")).toHaveTextContent(
      "Add Employee",
    );
  });

  it("opens read-only dialog when an employee row is clicked", async () => {
    const user = userEvent.setup();
    const employee = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
    } as unknown as Employee;

    vi.mocked(useEmployees).mockReturnValue({
      data: { employees: [employee], total: 1 },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useEmployees>);

    render(<EmployeesPage />);
    await user.click(screen.getByText("John Doe"));
    // Expect read-only view
    expect(screen.getByTestId("employee-form-dialog")).toHaveTextContent(
      "View Employee",
    );
  });

  it("opens edit dialog when edit button is clicked", async () => {
    const user = userEvent.setup();
    const employee = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
    } as unknown as Employee;

    vi.mocked(useEmployees).mockReturnValue({
      data: { employees: [employee], total: 1 },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useEmployees>);

    render(<EmployeesPage />);
    await user.click(screen.getByText("Edit Item"));
    expect(screen.getByTestId("employee-form-dialog")).toHaveTextContent(
      "Edit John",
    );
  });

  it("opens delete confirmation dialog and handles deletion", async () => {
    const user = userEvent.setup();
    const employee = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
    } as unknown as Employee;

    vi.mocked(useEmployees).mockReturnValue({
      data: { employees: [employee], total: 1 },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useEmployees>);

    render(<EmployeesPage />);

    // Click Delete in the list
    await user.click(screen.getByText("Delete Item"));

    // Verify Dialog
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    // Click Confirm button in dialog (assuming it says "Delete")
    const confirmButton = screen.getByText("Delete", { selector: "button" });
    await user.click(confirmButton);

    expect(mockDeleteEmployee).toHaveBeenCalledWith("1");
  });
});

describe("EmployeesPage - HR Access Control", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Add Employee button for HR users", () => {
    vi.mocked(useUserRole).mockReturnValue({
      isAdmin: false,
      isRecruiter: false,
      isInterviewer: false,
      isHR: true,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EmployeesPage />);
    expect(screen.getByText("Add Employee")).toBeInTheDocument();
  });

  it("hides Add Employee button for non-HR users", () => {
    vi.mocked(useUserRole).mockReturnValue({
      isAdmin: false,
      isRecruiter: false,
      isInterviewer: false,
      isHR: false,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EmployeesPage />);
    expect(screen.queryByText("Add Employee")).not.toBeInTheDocument();
  });
});
