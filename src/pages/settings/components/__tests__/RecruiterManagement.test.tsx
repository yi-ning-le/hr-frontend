import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import type { Recruiter } from "@/lib/api";
import { RecruiterManagement } from "../RecruiterManagement";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue || key,
  }),
}));

// Mock useUserRole
const mockUseUserRole = vi.fn();
vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: () => mockUseUserRole(),
}));

// Mock API dependencies
const mockInvalidateQueries = vi.fn();

vi.mock("@tanstack/react-query", () => {
  return {
    useQueryClient: () => ({
      invalidateQueries: mockInvalidateQueries,
    }),
    useQuery: ({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === "recruiters") {
        return {
          data: [
            {
              employeeId: "emp1",
              firstName: "John",
              lastName: "Doe",
              department: "HR",
            },
          ] as Recruiter[],
          isLoading: false,
          error: null,
        };
      }
      if (queryKey[0] === "employees") {
        return {
          data: {
            employees: [
              {
                id: "emp1", // Existing recruiter
                firstName: "John",
                lastName: "Doe",
                department: "HR",
              },
              {
                id: "emp2", // Candidate for recruiter
                firstName: "Jane",
                lastName: "Smith",
                department: "Engineering",
              },
            ],
          },
          isLoading: false,
        };
      }
      return { data: undefined, isLoading: false };
    },
    useMutation: ({ onSuccess }: { onSuccess: () => void }) => {
      return {
        mutate: () => {
          onSuccess?.();
        },
        isPending: false,
      };
    },
  };
});

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

// Mock Select (Radix UI based)
vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange: (val: string) => void;
  }) => (
    <div data-testid="select-root">
      <select
        data-testid="native-select"
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="emp2">Jane Smith</option>
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

describe("RecruiterManagement", () => {
  it("renders existing recruiters and allows interaction when admin", async () => {
    mockUseUserRole.mockReturnValue({ isAdmin: true, isLoading: false });
    const user = userEvent.setup();
    render(<RecruiterManagement />);

    // Verify existing recruiter is shown
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText("Recruiter Management")).toBeInTheDocument();

    // Verify "Add Recruiter" button
    const addButton = screen.getByText("Add Recruiter");
    expect(addButton).toBeInTheDocument();

    // Open Dialog
    await user.click(addButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Check if "Jane Smith" is selectable (mocked via native select for ease)
    const select = screen.getByTestId("native-select");
    await user.selectOptions(select, "emp2");

    // Click Assign
    const assignButton = screen.getByText("Assign");
    await user.click(assignButton);

    // Expect cache invalidation
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["recruiters"],
    });
  });

  it("shows access denied message when not admin", () => {
    mockUseUserRole.mockReturnValue({ isAdmin: false, isLoading: false });
    render(<RecruiterManagement />);

    expect(
      screen.getByText(/Admin access required to manage recruiters/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("Add Recruiter")).not.toBeInTheDocument();
  });
});
