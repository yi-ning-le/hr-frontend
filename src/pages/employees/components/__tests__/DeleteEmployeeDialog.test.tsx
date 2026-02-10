import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DeleteEmployeeDialog } from "../DeleteEmployeeDialog";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string, options?: any) => {
      if (key === "employees.deleteConfirmation" && options?.name) {
        return `Are you sure you want to delete ${options.name}? This action cannot be undone.`;
      }
      return defaultValue;
    },
  }),
}));

// Mock Radix UI Alert Dialog primitives if needed, but often not necessary with jsdom
// If rendering fails, we might need to mock @/components/ui/alert-dialog

describe("DeleteEmployeeDialog", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  it("should render correctly when open", () => {
    render(
      <DeleteEmployeeDialog
        open={true}
        employeeName="John Doe"
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText("Delete Employee")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to delete John Doe? This action cannot be undone.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("should not render when not open", () => {
    render(
      <DeleteEmployeeDialog
        open={false}
        employeeName="John Doe"
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.queryByText("Delete Employee")).not.toBeInTheDocument();
  });

  it("should call onClose when Cancel is clicked", () => {
    render(
      <DeleteEmployeeDialog
        open={true}
        employeeName="John Doe"
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call onConfirm when Delete is clicked", () => {
    render(
      <DeleteEmployeeDialog
        open={true}
        employeeName="John Doe"
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
