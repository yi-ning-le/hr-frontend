// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { InterviewTransferDialog } from "../InterviewTransferDialog";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

// Mock useUserRole
vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: () => ({
    isRecruiter: true,
    isAdmin: false,
    isInterviewer: false,
    isHR: false,
    isLoading: false,
  }),
}));

// Mock TanStack Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => ({
    data: {
      employees: [
        { id: "emp-1", firstName: "John", lastName: "Doe", department: "HR" },
        {
          id: "emp-2",
          firstName: "Jane",
          lastName: "Smith",
          department: "Engineering",
        },
      ],
    },
    isLoading: false,
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

// Mock API
vi.mock("@/lib/api", () => ({
  RecruitmentAPI: {
    transferInterview: vi.fn(),
  },
  EmployeesAPI: {
    list: vi.fn(),
  },
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock ResizeObserver
beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof globalThis.ResizeObserver;
});

describe("InterviewTransferDialog", () => {
  it("renders dialog with correct title when open", () => {
    render(
      <InterviewTransferDialog
        interviewId="interview-1"
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Transfer Interview")).toBeInTheDocument();
  });

  it("shows description with candidate name when provided", () => {
    render(
      <InterviewTransferDialog
        interviewId="interview-1"
        open={true}
        onOpenChange={vi.fn()}
        candidateName="John Doe"
      />,
    );

    // The translation mock returns the fallback with {{name}} template
    expect(
      screen.getByText(/Transfer the interview for.*to another employee/),
    ).toBeInTheDocument();
  });

  it("shows generic description when no candidate name", () => {
    render(
      <InterviewTransferDialog
        interviewId="interview-1"
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Transfer this interview to another employee."),
    ).toBeInTheDocument();
  });

  it("renders cancel and transfer buttons", () => {
    render(
      <InterviewTransferDialog
        interviewId="interview-1"
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Transfer")).toBeInTheDocument();
  });

  it("renders employee select label", () => {
    render(
      <InterviewTransferDialog
        interviewId="interview-1"
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Select New Interviewer")).toBeInTheDocument();
  });

  it("does not render content when closed", () => {
    render(
      <InterviewTransferDialog
        interviewId="interview-1"
        open={false}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.queryByText("Transfer Interview")).not.toBeInTheDocument();
  });
});
