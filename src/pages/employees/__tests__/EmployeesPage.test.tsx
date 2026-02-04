// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EmployeesPage } from "../EmployeesPage";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock useEmployeeStore
const mockFetchEmployees = vi.fn();
const mockSetFilters = vi.fn();
const mockSetPage = vi.fn();

vi.mock("@/stores/useEmployeeStore", () => ({
  useEmployeeStore: () => ({
    employees: [],
    pagination: { page: 1, limit: 10, total: 0 },
    filters: { search: "", status: "" },
    isLoading: false,
    fetchEmployees: mockFetchEmployees,
    setFilters: mockSetFilters,
    setPage: mockSetPage,
  }),
}));

// Mock child components
vi.mock("../components/EmployeeList", () => ({
  EmployeeList: () => <div data-testid="employee-list">Employee List</div>,
}));

vi.mock("../components/EmployeeFormDialog", () => ({
  EmployeeFormDialog: ({ open }: { open: boolean }) =>
    open ? <div data-testid="employee-form-dialog">Form Dialog</div> : null,
}));

describe("EmployeesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page header with title and subtitle", () => {
    render(<EmployeesPage />);

    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("Manage your team members")).toBeInTheDocument();
  });

  it("renders Add Employee button", () => {
    render(<EmployeesPage />);

    expect(screen.getByText("Add Employee")).toBeInTheDocument();
  });

  it("opens dialog when Add Employee button is clicked", async () => {
    const user = userEvent.setup();
    render(<EmployeesPage />);

    const addButton = screen.getByText("Add Employee");
    await user.click(addButton);

    expect(screen.getByTestId("employee-form-dialog")).toBeInTheDocument();
  });

  it("renders search input field", () => {
    render(<EmployeesPage />);

    expect(
      screen.getByPlaceholderText("Search by name or email..."),
    ).toBeInTheDocument();
  });

  it("renders status filter dropdown", () => {
    render(<EmployeesPage />);

    // Find filter by looking for the Select component or its trigger
    expect(screen.getByText("All Statuses")).toBeInTheDocument();
  });

  it("renders employee list component", () => {
    render(<EmployeesPage />);

    expect(screen.getByTestId("employee-list")).toBeInTheDocument();
  });

  it("calls fetchEmployees on mount", () => {
    render(<EmployeesPage />);

    expect(mockFetchEmployees).toHaveBeenCalled();
  });
});
