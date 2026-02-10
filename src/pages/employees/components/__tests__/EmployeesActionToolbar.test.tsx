import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeesActionToolbar } from "../EmployeesActionToolbar";

// Mock translations
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue: string) => defaultValue,
  }),
}));

// Partially mock Select to avoid Radix UI complexities in simple unit tests
// validation, keeping the structure but exposing interactions easier if needed.
// However, let's try with basic pointer events mock if Radix complains,
// or just rely on a simple mock for the functionality we care about (prop passing).
vi.mock("@/components/ui/select", () => ({
  Select: ({ onValueChange, children, value }: any) => (
    <div data-testid="mock-select">
      <div data-testid="select-value">{value}</div>
      <button onClick={() => onValueChange("Active")}>Select Active</button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <div>{placeholder}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
}));

describe("EmployeesActionToolbar", () => {
  const mockOnSearch = vi.fn();
  const mockOnStatusChange = vi.fn();

  it("should render correctly with default values", () => {
    render(
      <EmployeesActionToolbar
        onSearch={mockOnSearch}
        onStatusChange={mockOnStatusChange}
      />,
    );

    expect(
      screen.getByPlaceholderText("Search by name or email..."),
    ).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("should render with provided defaultSearchValue", () => {
    render(
      <EmployeesActionToolbar
        defaultSearchValue="test query"
        onSearch={mockOnSearch}
        onStatusChange={mockOnStatusChange}
      />,
    );

    expect(screen.getByDisplayValue("test query")).toBeInTheDocument();
  });

  it("should call onSearch when search form is submitted", () => {
    render(
      <EmployeesActionToolbar
        onSearch={mockOnSearch}
        onStatusChange={mockOnStatusChange}
      />,
    );

    const input = screen.getByPlaceholderText("Search by name or email...");
    fireEvent.change(input, { target: { value: "new search" } });
    fireEvent.submit(input.closest("form")!);

    expect(mockOnSearch).toHaveBeenCalledWith("new search");
  });

  it("should call onStatusChange when status is changed", () => {
    render(
      <EmployeesActionToolbar
        onSearch={mockOnSearch}
        onStatusChange={mockOnStatusChange}
      />,
    );

    // Using the mock to trigger change
    fireEvent.click(screen.getByText("Select Active"));
    expect(mockOnStatusChange).toHaveBeenCalledWith("Active");
  });
});
