// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Employee } from "@/types/employee";
import { EmployeeProfilePage } from "../EmployeeProfilePage";

const mockReturnSearch = {
  page: 3,
  limit: 50,
  search: "john",
  status: "Active",
  department: "Engineering",
};

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    search,
  }: {
    children: React.ReactNode;
    to: string;
    search?: unknown;
  }) => (
    <a href={to} data-search={search ? JSON.stringify(search) : undefined}>
      {children}
    </a>
  ),
}));

// Mock Route.useParams
vi.mock("@/routes/_protected/employees.$employeeId", () => ({
  Route: {
    useParams: () => ({ employeeId: "emp-1" }),
    useSearch: () => mockReturnSearch,
  },
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

const mockUseEmployee = vi.fn();

// Mock useEmployees hook
vi.mock("@/hooks/queries/useEmployees", () => ({
  useEmployee: (id: string) => mockUseEmployee(id),
}));

describe("EmployeeProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseEmployee.mockReturnValue({
      data: mockEmployee,
      isLoading: false,
      isError: false,
    });
  });

  it("renders back button", () => {
    render(<EmployeeProfilePage />);

    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders employee name and position", () => {
    render(<EmployeeProfilePage />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders employee status badge", () => {
    render(<EmployeeProfilePage />);

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders employee avatar with initials", () => {
    render(<EmployeeProfilePage />);

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders details card with employee information", () => {
    render(<EmployeeProfilePage />);

    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("FullTime")).toBeInTheDocument();
  });

  it("renders detail labels with translation keys", () => {
    render(<EmployeeProfilePage />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Employment Type")).toBeInTheDocument();
    expect(screen.getByText("Join Date")).toBeInTheDocument();
  });

  it("keeps list search context in back link", () => {
    render(<EmployeeProfilePage />);

    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
      "data-search",
      JSON.stringify(mockReturnSearch),
    );
  });

  it("keeps list search context when employee is not found", () => {
    mockUseEmployee.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<EmployeeProfilePage />);

    expect(screen.getByRole("link", { name: "Back to List" })).toHaveAttribute(
      "data-search",
      JSON.stringify(mockReturnSearch),
    );
  });

  it("shows not found state when request succeeds but employee is missing", () => {
    mockUseEmployee.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    render(<EmployeeProfilePage />);

    expect(screen.getByText("Employee not found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to List" })).toHaveAttribute(
      "data-search",
      JSON.stringify(mockReturnSearch),
    );
  });
});
