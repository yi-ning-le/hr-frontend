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

vi.mock("@/hooks/queries/useReviewers", () => ({
  useReviewers: () => ({
    data: [
      {
        employeeId: "e1",
        firstName: "Alice",
        lastName: "Smith",
        department: "Engineering",
      },
      {
        employeeId: "e2",
        firstName: "Bob",
        lastName: "Jones",
        department: "HR",
      },
    ],
    isLoading: false,
  }),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

// Mock PersonCombobox for simplified testing
vi.mock("@/components/candidates/PersonCombobox", () => ({
  PersonCombobox: ({
    value,
    onChange,
    placeholder,
    options,
  }: {
    value: string;
    onChange: (id: string) => void;
    placeholder: string;
    options: Array<{ id: string; firstName: string; lastName: string }>;
  }) => (
    <div data-testid="person-combobox">
      <span>
        {value ? options.find((o) => o.id === value)?.firstName : placeholder}
      </span>
      <select
        data-testid="person-combobox-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.firstName} {o.lastName}
          </option>
        ))}
      </select>
    </div>
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
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.setPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

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

  it("should render PersonCombobox", () => {
    render(
      <AssignReviewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    expect(screen.getByTestId("person-combobox")).toBeInTheDocument();
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

    // Select a reviewer via the mock combobox
    const select = screen.getByTestId("person-combobox-select");
    await user.selectOptions(select, "e1");

    // Submit
    const submitButton = screen.getByRole("button", { name: "Save" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(CandidatesAPI.assignReviewer).toHaveBeenCalledWith("1", "e1");
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
