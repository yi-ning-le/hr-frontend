// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { AssignInterviewerDialog } from "../AssignInterviewerDialog";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock hooks
const mockMutateAsync = vi.fn().mockResolvedValue(undefined);
vi.mock("@/hooks/queries/useInterviews", () => ({
  useCreateInterview: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

const mockEmployees = [
  { id: "emp1", firstName: "Alice", lastName: "Smith" },
  { id: "emp2", firstName: "Bob", lastName: "Jones" },
];

vi.mock("@/hooks/queries/useEmployees", () => ({
  useEmployees: () => ({
    data: { employees: mockEmployees },
  }),
}));

// Mock Calendar component
vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({
    onSelect,
    selected,
    disabled,
  }: {
    onSelect: (date: Date | undefined) => void;
    selected: Date | undefined;
    disabled: (date: Date) => boolean;
  }) => {
    const today = new Date("2024-01-01");
    const tomorrow = new Date("2024-01-02");
    return (
      <div data-testid="calendar">
        <div>Selected: {selected ? selected.toISOString() : "None"}</div>
        <button
          data-testid="select-today"
          onClick={() => onSelect(today)}
          disabled={disabled?.(today)}
        >
          Select Today
        </button>
        <button
          data-testid="select-tomorrow"
          onClick={() => onSelect(tomorrow)}
          disabled={disabled?.(tomorrow)}
        >
          Select Tomorrow
        </button>
      </div>
    );
  },
}));

// Mock Select component
vi.mock("@/components/ui/select", () => ({
  Select: ({ onValueChange, children, value, defaultValue }: any) => {
    return (
      <select
        data-testid="select-native"
        value={value || defaultValue || ""}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {children}
      </select>
    );
  },
  SelectTrigger: ({ children }: any) => <>{children}</>,
  SelectValue: ({ placeholder }: any) => (
    <option value="">{placeholder}</option>
  ),
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ value, children, disabled }: any) => (
    <option value={value} disabled={disabled}>
      {children}
    </option>
  ),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock ResizeObserver
beforeEach(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof globalThis.ResizeObserver;
});

afterEach(() => {
  vi.clearAllMocks();
});

const mockCandidate: Candidate = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  experienceYears: 5,
  education: "Bachelor",
  appliedJobId: "job1",
  appliedJobTitle: "Frontend Developer",
  channel: "LinkedIn",
  resumeUrl: "resume.pdf",
  status: "new",
  appliedAt: new Date("2024-01-01"),
  note: "Good candidate",
};

describe("AssignInterviewerDialog", () => {
  it("renders correctly", () => {
    render(
      <AssignInterviewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("recruitment.interviews.assignTitle"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.interviews.interviewer"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.interviews.scheduledTime"),
    ).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(
      <AssignInterviewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    // Click submit without filling anything
    await user.click(screen.getByText("common.assign"));

    expect(
      await screen.findByText(
        "recruitment.interviews.validation.interviewerRequired",
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "recruitment.interviews.validation.scheduledTimeRequired",
      ),
    ).toBeInTheDocument();
  });
});
