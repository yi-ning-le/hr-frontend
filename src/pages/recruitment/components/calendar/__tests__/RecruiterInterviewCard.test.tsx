import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecruiterInterviewCard } from "../RecruiterInterviewCard";

// Mock dependencies
vi.mock("@/components/interviews/EditInterviewDialog", () => ({
  EditInterviewDialog: ({ open, interview }: any) =>
    open ? <div data-testid="edit-dialog">{interview.id}</div> : null,
}));

vi.mock("@/hooks/useCandidateStatuses", () => ({
  useResolveCandidateStatus: () => ({
    resolveStatus: () => ({ name: "Screening", color: "blue" }),
  }),
}));

const mockDeleteInterview = vi.fn();
vi.mock("@/hooks/queries/useInterviews", () => ({
  useDeleteInterview: () => ({
    mutateAsync: mockDeleteInterview,
    isPending: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultVal: string) => defaultVal || key,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderComponent = (props: any) =>
  render(
    <QueryClientProvider client={queryClient}>
      <RecruiterInterviewCard {...props} />
    </QueryClientProvider>,
  );

describe("RecruiterInterviewCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockInterview = {
    id: "1",
    jobId: "j1",
    candidateId: "c1",
    interviewerId: "i1",
    interviewerName: "Bob",
    scheduledTime: "2023-10-10T10:00:00Z",
    scheduledEndTime: "2023-10-10T11:00:00Z",
    status: "PENDING",
    createdAt: "2023-10-10T09:00:00Z",
  };
  const mockCandidate = {
    id: "c1",
    name: "Alice",
    email: "alice@example.com",
    phone: "1234567890",
    experienceYears: 5,
    education: "BSc",
    appliedJobId: "j1",
    appliedJobTitle: "Dev",
    channel: "LinkedIn",
    resumeUrl: "http://resume.url",
    status: "SCREENING",
    appliedAt: new Date("2023-10-01T10:00:00Z"),
  };

  const defaultProps = {
    interview: mockInterview,
    candidate: mockCandidate,
    onPreviewResume: vi.fn(),
  };

  it("renders candidate and interview info", () => {
    renderComponent(defaultProps);
    expect(screen.getByText("Alice")).toBeDefined();
    expect(screen.getByText("Dev")).toBeDefined();
    expect(screen.getByText("Bob")).toBeDefined();
    // Check status badge from mock
    expect(screen.getByText("Screening")).toBeDefined();
  });

  it("calls onPreviewResume when view resume button clicked", async () => {
    const user = userEvent.setup();
    const onPreview = vi.fn();
    renderComponent({ ...defaultProps, onPreviewResume: onPreview });

    await user.click(screen.getByText("View Resume"));
    expect(onPreview).toHaveBeenCalledWith(mockCandidate);
  });

  it("opens edit dialog when edit button clicked", async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);

    await user.click(screen.getByLabelText("Edit Interview"));

    expect(screen.getByTestId("edit-dialog")).toBeDefined();
  });

  it("shows delete button only for pending interviews", () => {
    const { rerender } = renderComponent(defaultProps);
    expect(screen.getByLabelText("Delete Interview")).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={queryClient}>
        <RecruiterInterviewCard
          {...defaultProps}
          interview={{ ...mockInterview, status: "COMPLETED" }}
        />
      </QueryClientProvider>,
    );
    expect(screen.queryByLabelText("Delete Interview")).not.toBeInTheDocument();
  });

  it("deletes interview after confirmation", async () => {
    const user = userEvent.setup();
    mockDeleteInterview.mockResolvedValueOnce(undefined);
    renderComponent(defaultProps);

    await user.click(screen.getByLabelText("Delete Interview"));
    expect(screen.getByText("Delete Interview")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(mockDeleteInterview).toHaveBeenCalledWith("1");
    });
  });
});
