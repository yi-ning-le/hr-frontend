// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import type { EmployeeAPIResponse } from "@/lib/api";
import { AddRecruiterDialog } from "../AddRecruiterDialog";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue || key,
  }),
}));

// Mock UI Components (Dialog specifically)
const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

vi.mock("@/components/ui/dialog", () => {
  return {
    Dialog: ({
      children,
      open,
      onOpenChange,
    }: {
      children: React.ReactNode;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    }) => (
      <DialogContext.Provider
        value={{ open: !!open, setOpen: onOpenChange || (() => {}) }}
      >
        <div>{children}</div>
      </DialogContext.Provider>
    ),
    DialogContent: ({ children }: { children: React.ReactNode }) => {
      const { open } = React.useContext(DialogContext);
      return open ? <div role="dialog">{children}</div> : null;
    },
    DialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogTitle: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogDescription: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogTrigger: ({ children }: { children: React.ReactNode }) => {
      const { setOpen } = React.useContext(DialogContext);
      return <div onClick={() => setOpen(true)}>{children}</div>;
    },
  };
});

// Mock Select
vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
    value,
  }: {
    children: React.ReactNode;
    onValueChange: (val: string) => void;
    value: string;
  }) => (
    <div data-testid="select-root">
      <select
        data-testid="native-select"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="">Select an employee</option>
        <option value="emp1">John Doe - HR</option>
        <option value="emp2">Jane Smith - Engineering</option>
      </select>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: () => <div>Select Value</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockEmployees: EmployeeAPIResponse[] = [
  {
    id: "emp1",
    firstName: "John",
    lastName: "Doe",
    department: "HR",
    email: "john@example.com",
    position: "Manager",
  } as unknown as EmployeeAPIResponse,
  {
    id: "emp2",
    firstName: "Jane",
    lastName: "Smith",
    department: "Engineering",
    email: "jane@example.com",
    position: "Developer",
  } as unknown as EmployeeAPIResponse,
];

describe("AddRecruiterDialog", () => {
  it("renders the trigger button", () => {
    render(
      <AddRecruiterDialog
        open={false}
        onOpenChange={() => {}}
        onAssign={() => {}}
        isAssigning={false}
        availableEmployees={[]}
      />,
    );

    expect(screen.getByText("Add Recruiter")).toBeInTheDocument();
  });

  it("opens the dialog and shows available employees", async () => {
    const user = userEvent.setup();
    render(
      <AddRecruiterDialog
        open={false}
        onOpenChange={() => {}}
        onAssign={() => {}}
        isAssigning={false}
        availableEmployees={mockEmployees}
      />,
    );

    await user.click(screen.getByText("Add Recruiter"));
  });

  it("calls onAssign with selected employee id", async () => {
    const onAssign = vi.fn();
    const user = userEvent.setup();

    render(
      <AddRecruiterDialog
        open={true}
        onOpenChange={() => {}}
        onAssign={onAssign}
        isAssigning={false}
        availableEmployees={mockEmployees}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const select = screen.getByTestId("native-select");
    await user.selectOptions(select, "emp2");

    const assignButton = screen.getByText("Assign");
    await user.click(assignButton);

    expect(onAssign).toHaveBeenCalledWith("emp2");
  });

  it("shows loading state when isAssigning is true", () => {
    render(
      <AddRecruiterDialog
        open={true}
        onOpenChange={() => {}}
        onAssign={() => {}}
        isAssigning={true}
        availableEmployees={mockEmployees}
      />,
    );

    const assignButton = screen.getByText("Assign");
    expect(assignButton).toBeDisabled();
  });
});
