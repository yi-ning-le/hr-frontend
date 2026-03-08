import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Interview } from "@/types/recruitment.d";
import { InterviewHeader } from "../InterviewHeader";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

// Mock Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

// Mock UI components
vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children }: any) => <div>{children}</div>,
  AlertDialogTrigger: ({ children }: any) => (
    <div role="button" className="trigger">
      {children}
    </div>
  ),
  AlertDialogContent: ({ children }: any) => (
    <div className="content">{children}</div>
  ),
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: any) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogCancel: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  AlertDialogAction: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="confirm-action">
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/radio-group", () => ({
  RadioGroup: ({ children, value }: any) => (
    <div data-testid="radio-group" data-value={value}>
      {children}
    </div>
  ),
  RadioGroupItem: ({ value, id }: any) => (
    <input
      type="radio"
      value={value}
      id={id}
      data-testid={`radio-${value}`}
      onChange={() => {}}
    />
  ),
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

describe("InterviewHeader", () => {
  const mockInterview: Interview = {
    id: "i1",
    candidateId: "c1",
    jobId: "j1",
    interviewerId: "int1",
    scheduledTime: new Date().toISOString(),
    scheduledEndTime: new Date().toISOString(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  it("renders status badge", () => {
    render(
      <InterviewHeader
        interview={mockInterview}
        isUpdating={false}
        onUpdateStatus={vi.fn()}
      />,
    );

    expect(
      screen.getByText("recruitment.interviews.status.PENDING"),
    ).toBeInTheDocument();
  });

  it("renders action buttons when status is PENDING", () => {
    render(
      <InterviewHeader
        interview={mockInterview}
        isUpdating={false}
        onUpdateStatus={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Complete Interview").length).toBeGreaterThan(0);
    expect(screen.getByText("Cancel Interview")).toBeInTheDocument();
  });

  it("does not render action buttons when status is not PENDING", () => {
    const completedInterview = {
      ...mockInterview,
      status: "COMPLETED" as const,
    };
    render(
      <InterviewHeader
        interview={completedInterview}
        isUpdating={false}
        onUpdateStatus={vi.fn()}
      />,
    );

    expect(screen.queryByText("Complete Interview")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancel Interview")).not.toBeInTheDocument();
  });

  it("renders PASS/FAIL radio buttons in completion dialog", () => {
    render(
      <InterviewHeader
        interview={mockInterview}
        isUpdating={false}
        onUpdateStatus={vi.fn()}
      />,
    );

    expect(screen.getByText("Pass")).toBeInTheDocument();
    expect(screen.getByText("Fail")).toBeInTheDocument();
    expect(screen.getByText("Interview Result")).toBeInTheDocument();
  });

  it("calls onUpdateStatus with CANCELLED for cancel action", () => {
    const onUpdateStatus = vi.fn();
    render(
      <InterviewHeader
        interview={mockInterview}
        isUpdating={false}
        onUpdateStatus={onUpdateStatus}
      />,
    );

    // There are multiple confirm buttons. The cancel dialog's confirm is the last one.
    const confirmButtons = screen.getAllByText("Confirm");
    const cancelConfirm = confirmButtons[confirmButtons.length - 1];
    fireEvent.click(cancelConfirm);

    expect(onUpdateStatus).toHaveBeenCalledWith({
      id: "i1",
      status: "CANCELLED",
    });
  });
});
