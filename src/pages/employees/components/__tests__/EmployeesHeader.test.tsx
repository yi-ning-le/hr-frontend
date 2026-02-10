import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeesHeader } from "../EmployeesHeader";

// Mock translations
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue: string) => defaultValue,
  }),
}));

describe("EmployeesHeader", () => {
  const mockOnRefresh = vi.fn();
  const mockOnAdd = vi.fn();

  it("should render correctly", () => {
    render(
      <EmployeesHeader
        total={10}
        isHR={false}
        onRefresh={mockOnRefresh}
        onAdd={mockOnAdd}
      />,
    );

    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("Manage your team members")).toBeInTheDocument();
    expect(screen.getByText("Total: 10")).toBeInTheDocument();
    expect(screen.getByTitle("Refresh")).toBeInTheDocument();
    expect(screen.queryByText("Add Employee")).not.toBeInTheDocument();
  });

  it("should render Add Employee button when isHR is true", () => {
    render(
      <EmployeesHeader
        total={10}
        isHR={true}
        onRefresh={mockOnRefresh}
        onAdd={mockOnAdd}
      />,
    );

    expect(screen.getByText("Add Employee")).toBeInTheDocument();
  });

  it("should call onRefresh when Refresh button is clicked", () => {
    render(
      <EmployeesHeader
        total={10}
        isHR={false}
        onRefresh={mockOnRefresh}
        onAdd={mockOnAdd}
      />,
    );

    fireEvent.click(screen.getByTitle("Refresh"));
    expect(mockOnRefresh).toHaveBeenCalled();
  });

  it("should call onAdd when Add Employee button is clicked", () => {
    render(
      <EmployeesHeader
        total={10}
        isHR={true}
        onRefresh={mockOnRefresh}
        onAdd={mockOnAdd}
      />,
    );

    fireEvent.click(screen.getByText("Add Employee"));
    expect(mockOnAdd).toHaveBeenCalled();
  });
});
