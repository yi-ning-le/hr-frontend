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

// Mock UI components that might cause issues in tests or to simplify
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
  AlertDialogCancel: ({ children }: any) => <button>{children}</button>,
  AlertDialogAction: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
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

    // The key is recruitment.interviews.status.PENDING
    // The mock returns the key if default value is not provided
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

    expect(screen.getByText("Complete Interview")).toBeInTheDocument();
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

  it("calls onUpdateStatus when confirming action", () => {
    const onUpdateStatus = vi.fn();
    render(
      <InterviewHeader
        interview={mockInterview}
        isUpdating={false}
        onUpdateStatus={onUpdateStatus}
      />,
    );

    // Click "Complete Interview" trigger (which is mocked as a div with role button)
    // Wait, I mocked AlertDialogTrigger as just a div.
    // The structure is:
    // AlertDialog
    //   AlertDialogTrigger -> Button "Complete Interview"
    //   AlertDialogContent -> AlertDialogAction "Confirm"

    // In the real component, clicking Trigger opens Content.
    // In my mock, everything is rendered?
    // Let's check the mock again.
    // AlertDialog renders children.
    // AlertDialogTrigger renders children.
    // AlertDialogContent renders children.

    // So "Confirm" buttons are probably visible in the DOM immediately with my naive mock.
    // There are two "Confirm" buttons (one for complete, one for cancel).

    const confirmButtons = screen.getAllByText("Confirm");
    fireEvent.click(confirmButtons[0]); // Complete confirm

    expect(onUpdateStatus).toHaveBeenCalledWith("i1", "COMPLETED");

    fireEvent.click(confirmButtons[1]); // Cancel confirm
    expect(onUpdateStatus).toHaveBeenCalledWith("i1", "CANCELLED");
  });
});
