import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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
  const mockInterview = {
    id: "1",
    candidateId: "c1",
    interviewerId: "i1",
    interviewerName: "Bob",
    scheduledTime: "2023-10-10T10:00:00Z",
    scheduledEndTime: "2023-10-10T11:00:00Z",
    status: "PENDING",
  };
  const mockCandidate = {
    id: "c1",
    name: "Alice",
    appliedJobTitle: "Dev",
    resumeUrl: "http://resume.url",
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

    // Filter by testId or look for icon button.
    // The edit button has an Edit icon. We can find by role button.
    // But there are two buttons. "View Resume" and the edit icon button.
    // The edit icon button has variant="ghost" and size="icon".
    // Let's find by class or just try picking one.
    // Or add aria-label to the button in component (best practice).
    // For now, let's look for the edit icon if possible, or select all buttons.

    // Actually, one button has text "View Resume". The other has icon.
    // We can click the one without text or check logic.
    // Let's query buttons.
    const buttons = screen.getAllByRole("button");
    // 1. Edit button (icon)
    // 2. View Resume button
    // The edit button is in the header.

    // Let's rely on the fact that we can find it structurally or add aria-label later.
    // Assuming the icon button comes first in DOM order or we can target it.
    // But let's check if we can query by icon? No.

    // Let's click the first button, which is the Edit button in the header.
    await user.click(buttons[0]);

    expect(screen.getByTestId("edit-dialog")).toBeDefined();
  });
});
