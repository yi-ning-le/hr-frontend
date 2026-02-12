import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CandidatesAPI } from "@/lib/api";
import { AssignReviewerDialog } from "../AssignReviewerDialog";

// Mock dependencies
vi.mock("@/lib/api", () => ({
  CandidatesAPI: {
    assignReviewer: vi.fn(),
  },
  EmployeesAPI: {
    list: vi.fn(),
  },
}));

vi.mock("@/hooks/queries/useEmployees", () => ({
  useEmployees: () => ({
    data: {
      employees: [
        {
          id: "e1",
          userId: "u1",
          firstName: "Alice",
          lastName: "Smith",
          email: "alice@example.com",
        },
        {
          id: "e2",
          userId: "u2",
          firstName: "Bob",
          lastName: "Jones",
          email: "bob@example.com",
        },
      ],
      total: 2,
    },
    isLoading: false,
  }),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

// Mock UI components to simplify testing
vi.mock("@/components/ui/select", () => ({
  Select: ({ onValueChange, children }: any) => (
    <div data-testid="select-mock" onClick={() => onValueChange?.("e1")}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: () => <div>Select Value</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ value, children }: any) => (
    <div data-value={value}>{children}</div>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue || key,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("AssignReviewerDialog", () => {
  const mockCandidate = {
    id: "1",
    name: "John Doe",
  } as any;

  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock pointer capture methods for radix-ui
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.setPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock ResizeObserver
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it("should render correctly when open", () => {
    render(
      <AssignReviewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    expect(screen.getByText("Assign Reviewer")).toBeInTheDocument();
    expect(
      screen.getByText("Select an interviewer to review this candidate."),
    ).toBeInTheDocument();
  });

  it("should submit assignment successfully", async () => {
    render(
      <AssignReviewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    const user = userEvent.setup();

    // Trigger value change directly via mock interaction
    const selectMock = screen.getByTestId("select-mock");
    await user.click(selectMock);

    // Submit
    const submitButton = screen.getByRole("button", { name: "Save" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(CandidatesAPI.assignReviewer).toHaveBeenCalledWith("1", "e1");
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
