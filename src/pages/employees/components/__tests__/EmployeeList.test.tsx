// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EmployeeList } from "../EmployeeList";
import type { Employee } from "@/types/employee";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

const mockEmployees: Employee[] = [
  {
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
  },
  {
    id: "emp-2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "0987654321",
    department: "Marketing",
    position: "Marketing Manager",
    status: "OnLeave",
    employmentType: "PartTime",
    joinDate: new Date("2023-06-20"),
  },
];

describe("EmployeeList", () => {
  it("renders loading state with skeletons", () => {
    render(<EmployeeList employees={[]} isLoading={true} onEdit={vi.fn()} />);

    // Loading state should show skeleton elements
    const skeletons = document.querySelectorAll(
      '[class*="animate-pulse"], [data-slot="skeleton"]',
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders empty state when no employees", () => {
    render(<EmployeeList employees={[]} isLoading={false} onEdit={vi.fn()} />);

    expect(screen.getByText("employees.noEmployees")).toBeInTheDocument();
    expect(
      screen.getByText("employees.noEmployeesDescription"),
    ).toBeInTheDocument();
    expect(screen.getByText("👥")).toBeInTheDocument();
  });

  it("renders table headers correctly", () => {
    render(
      <EmployeeList
        employees={mockEmployees}
        isLoading={false}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("employees.columns.name")).toBeInTheDocument();
    expect(
      screen.getByText("employees.columns.department"),
    ).toBeInTheDocument();
    expect(screen.getByText("employees.columns.position")).toBeInTheDocument();
    expect(screen.getByText("employees.columns.status")).toBeInTheDocument();
    expect(screen.getByText("employees.columns.joinDate")).toBeInTheDocument();
  });

  it("renders employee data in table rows", () => {
    render(
      <EmployeeList
        employees={mockEmployees}
        isLoading={false}
        onEdit={vi.fn()}
      />,
    );

    // Check employee names are displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    // Check employee emails
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane.smith@example.com")).toBeInTheDocument();

    // Check departments
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();

    // Check positions
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Marketing Manager")).toBeInTheDocument();
  });

  it("renders status badges with translated labels", () => {
    render(
      <EmployeeList
        employees={mockEmployees}
        isLoading={false}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("employees.status.active")).toBeInTheDocument();
    expect(screen.getByText("employees.status.onLeave")).toBeInTheDocument();
  });

  it("renders employee avatars with initials", () => {
    render(
      <EmployeeList
        employees={mockEmployees}
        isLoading={false}
        onEdit={vi.fn()}
      />,
    );

    // Check for avatar fallback initials
    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("JS")).toBeInTheDocument();
  });
});
