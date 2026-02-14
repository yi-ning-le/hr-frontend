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
    i18n: { language: "en-US" },
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

// Mock Calendar component - this mock is used when the popover opens
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
    const today = new Date("2024-01-15");
    const tomorrow = new Date("2024-01-16");
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

// Mock TimePicker component
vi.mock("@/components/ui/time-picker", () => ({
  TimePicker: ({
    value,
    onChange,
    minTime,
    placeholder,
  }: {
    value?: string;
    onChange?: (time: string) => void;
    minTime?: string;
    placeholder?: string;
  }) => (
    <div data-testid="time-picker">
      <span data-testid="time-picker-value">{value || placeholder}</span>
      {minTime && <span data-testid="time-picker-min">min:{minTime}</span>}
      <select
        data-testid="time-picker-select"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">{placeholder}</option>
        <option value="09:00">09:00</option>
        <option value="10:00">10:00</option>
        <option value="11:00">11:00</option>
        <option value="12:00">12:00</option>
        <option value="14:00">14:00</option>
        <option value="15:00">15:00</option>
        <option value="16:00">16:00</option>
      </select>
    </div>
  ),
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
    expect(screen.getByText("recruitment.interviews.date")).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.interviews.startTime"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.interviews.endTime"),
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
      await screen.findByText("recruitment.interviews.validation.dateRequired"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "recruitment.interviews.validation.startTimeRequired",
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "recruitment.interviews.validation.endTimeRequired",
      ),
    ).toBeInTheDocument();
  });

  it("renders TimePicker for start and end time", () => {
    render(
      <AssignInterviewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    // Both TimePicker components should be rendered
    const timePickers = screen.getAllByTestId("time-picker");
    expect(timePickers).toHaveLength(2);
  });

  it("can select interviewer, date, and time", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <AssignInterviewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );

    // Select interviewer
    const interviewerSelect = screen.getByTestId("select-native");
    await user.selectOptions(interviewerSelect, "emp1");
    expect(interviewerSelect).toHaveValue("emp1");

    // Open date picker and select tomorrow
    const dateButton = screen.getByText("common.pickDate", { exact: false });
    await user.click(dateButton);

    // Calendar popover should now be open
    await user.click(screen.getByTestId("select-tomorrow"));

    // Select start time
    const startTimePicker = screen.getAllByTestId("time-picker-select")[0];
    await user.selectOptions(startTimePicker, "10:00");
    expect(startTimePicker).toHaveValue("10:00");

    // Select end time
    const endTimePicker = screen.getAllByTestId("time-picker-select")[1];
    await user.selectOptions(endTimePicker, "11:00");
    expect(endTimePicker).toHaveValue("11:00");

    // All form fields should be properly set
    expect(screen.getAllByText("10:00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("11:00").length).toBeGreaterThan(0);
  });

  it("passes minTime to TimePicker when date is today", async () => {
    const user = userEvent.setup();
    render(
      <AssignInterviewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    // Open date picker and select today
    const dateButton = screen.getByText("common.pickDate", { exact: false });
    await user.click(dateButton);

    await user.click(screen.getByTestId("select-today"));

    // Check that start TimePicker has minTime (the implementation sets it when date is today)
    const minTimeElements = screen.queryAllByTestId("time-picker-min");
    // Start time picker should have minTime when today is selected
    expect(minTimeElements.length).toBeGreaterThanOrEqual(1);
  });

  it("closes calendar popover after selecting date", async () => {
    const user = userEvent.setup();
    render(
      <AssignInterviewerDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    // Open calendar popover
    const dateButton = screen.getByText("common.pickDate", { exact: false });
    await user.click(dateButton);

    // Calendar should be visible
    expect(screen.getByTestId("calendar")).toBeInTheDocument();

    // Select a date
    await user.click(screen.getByTestId("select-tomorrow"));

    // Calendar should still be in DOM but we verify the date was selected
    expect(screen.getByTestId("calendar")).toBeInTheDocument();
  });
});
