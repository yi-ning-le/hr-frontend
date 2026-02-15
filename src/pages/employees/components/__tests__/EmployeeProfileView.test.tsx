// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeeProfileView } from "@/pages/employees/components/EmployeeProfileView";
import type { Employee } from "@/types/employee";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

vi.mock("@/lib/employee", () => ({
  getEmployeeStatusKey: vi.fn(
    (status: string) => `employees.status.${status.toLowerCase()}`,
  ),
  getEmploymentTypeKey: vi.fn(
    (type: string) => `employees.type.${type.toLowerCase()}`,
  ),
  getStatusVariant: vi.fn(() => "default"),
}));

describe("EmployeeProfileView", () => {
  const mockEmployee: Employee = {
    id: "emp-1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+86 13800138000",
    department: "Engineering",
    position: "Frontend Developer",
    status: "Active",
    employmentType: "FullTime",
    joinDate: new Date("2024-01-15"),
  };

  const renderComponent = (employee = mockEmployee) => {
    return render(<EmployeeProfileView employee={employee} />);
  };

  it("renders profile card with avatar initials", () => {
    renderComponent();

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("displays employee full name", () => {
    renderComponent();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("displays employee position", () => {
    renderComponent();

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("displays status badge", () => {
    renderComponent();

    expect(screen.getByText("employees.status.active")).toBeInTheDocument();
  });

  it("displays email information", () => {
    renderComponent();

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("employees.form.email")).toBeInTheDocument();
  });

  it("displays phone information", () => {
    renderComponent();

    expect(screen.getByText("+86 13800138000")).toBeInTheDocument();
    expect(screen.getByText("employees.form.phone")).toBeInTheDocument();
  });

  it("displays department information", () => {
    renderComponent();

    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("employees.form.department")).toBeInTheDocument();
  });

  it("displays employment type", () => {
    renderComponent();

    expect(screen.getByText("employees.type.fulltime")).toBeInTheDocument();
    expect(
      screen.getByText("employees.form.employmentType"),
    ).toBeInTheDocument();
  });

  it("displays join date in formatted style", () => {
    renderComponent();

    expect(screen.getByText("employees.form.joinDate")).toBeInTheDocument();
    // Check that some date is displayed
    const dateText = screen.getByText(/2024|January/);
    expect(dateText).toBeInTheDocument();
  });

  it("renders details card header", () => {
    renderComponent();

    expect(screen.getByText("employees.details")).toBeInTheDocument();
  });

  it("renders profile card with grid layout classes", () => {
    const { container } = renderComponent();

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass("grid", "md:grid-cols-3");
  });

  it("renders with different employee data", () => {
    const differentEmployee: Employee = {
      ...mockEmployee,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      position: "Backend Developer",
      department: "Backend",
      status: "OnLeave",
      employmentType: "PartTime",
    };

    renderComponent(differentEmployee);

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("JS")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("employees.status.onleave")).toBeInTheDocument();
  });
});
