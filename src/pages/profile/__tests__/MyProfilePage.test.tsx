// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MyProfilePage } from "@/pages/profile/MyProfilePage";
import type { Employee } from "@/types/employee";

// Mock the employee module
vi.mock("@/lib/employee", () => ({
  getEmployeeStatusKey: vi.fn(
    (status: string) => `employees.status.${status.toLowerCase()}`,
  ),
  getEmploymentTypeKey: vi.fn(
    (type: string) => `employees.type.${type.toLowerCase()}`,
  ),
  getStatusVariant: vi.fn(() => "default"),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

vi.mock("@/hooks/queries/useEmployees", () => ({
  useMyEmployeeProfile: vi.fn(),
}));

// Mock the EmployeeProfileView component
vi.mock("@/pages/employees/components/EmployeeProfileView", () => ({
  EmployeeProfileView: ({ employee }: { employee: Employee }) => (
    <div data-testid="employee-profile-view">
      {employee.firstName} {employee.lastName}
    </div>
  ),
}));

import { useMyEmployeeProfile } from "@/hooks/queries/useEmployees";

const mockedUseMyEmployeeProfile = vi.mocked(useMyEmployeeProfile);

describe("MyProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton when isLoading is true", () => {
    mockedUseMyEmployeeProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useMyEmployeeProfile>);

    const { container } = render(<MyProfilePage />);

    // Skeleton component uses inline style for animation
    const skeletonElements = container.querySelectorAll(
      '[style*="animation"], [class*="animate"], [class*="bg-muted"]',
    );
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it("renders error message when isError is true", () => {
    mockedUseMyEmployeeProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useMyEmployeeProfile>);

    render(<MyProfilePage />);

    expect(screen.getByText("employees.notFound")).toBeInTheDocument();
  });

  it("renders error message when employee data is null", () => {
    mockedUseMyEmployeeProfile.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useMyEmployeeProfile>);

    render(<MyProfilePage />);

    expect(screen.getByText("employees.notFound")).toBeInTheDocument();
  });

  it("renders profile page with title when data is loaded", () => {
    const mockEmployee: Employee = {
      id: "emp-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+86 13800138000",
      department: "Engineering",
      position: "Developer",
      status: "Active",
      employmentType: "FullTime",
      joinDate: new Date("2024-01-15"),
    };

    mockedUseMyEmployeeProfile.mockReturnValue({
      data: mockEmployee,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useMyEmployeeProfile>);

    render(<MyProfilePage />);

    expect(screen.getByText("header.profile")).toBeInTheDocument();
    expect(screen.getByTestId("employee-profile-view")).toBeInTheDocument();
  });

  it("renders EmployeeProfileView with employee data", () => {
    const mockEmployee: Employee = {
      id: "emp-1",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "+86 13800138001",
      department: "Marketing",
      position: "Manager",
      status: "OnLeave",
      employmentType: "PartTime",
      joinDate: new Date("2023-06-01"),
    };

    mockedUseMyEmployeeProfile.mockReturnValue({
      data: mockEmployee,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useMyEmployeeProfile>);

    render(<MyProfilePage />);

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });
});
