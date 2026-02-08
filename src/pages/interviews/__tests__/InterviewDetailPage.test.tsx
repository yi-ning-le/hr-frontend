import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as useCandidates from "@/hooks/queries/useCandidates";
import * as useInterviews from "@/hooks/queries/useInterviews";
import { InterviewDetailPage } from "../InterviewDetailPage";

// Mock hooks
vi.mock("@/hooks/queries/useInterviews");
vi.mock("@/hooks/queries/useCandidates");
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useParams: () => ({ interviewId: "1" }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: { type: "3rdParty" },
}));

describe("InterviewDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockInterview = {
    id: "1",
    candidateId: "c1",
    interviewerId: "e1",
    jobId: "j1",
    scheduledTime: new Date("2023-10-27T10:00:00Z").toISOString(),
    status: "PENDING",
    notes: "Initial notes",
    createdAt: new Date().toISOString(),
  };

  const mockCandidate = {
    id: "c1",
    name: "John Doe",
    appliedJobTitle: "Software Engineer",
    email: "john@example.com",
    phone: "123-456-7890",
  };

  it("renders interview details", () => {
    vi.mocked(useInterviews.useInterview).mockReturnValue({
      data: mockInterview,
      isLoading: false,
    } as unknown as ReturnType<typeof useInterviews.useInterview>);

    vi.mocked(useCandidates.useCandidates).mockReturnValue({
      data: [mockCandidate],
      isLoading: false,
    } as unknown as ReturnType<typeof useCandidates.useCandidates>);

    vi.mocked(useInterviews.useUpdateInterviewNotes).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useInterviews.useUpdateInterviewNotes>);

    render(<InterviewDetailPage />);

    expect(
      screen.getByText("recruitment.interviews.interviewDetails"),
    ).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Initial notes")).toBeInTheDocument();
  });

  it("updates notes", async () => {
    const updateNotesMock = vi.fn();
    vi.mocked(useInterviews.useInterview).mockReturnValue({
      data: mockInterview,
      isLoading: false,
    } as unknown as ReturnType<typeof useInterviews.useInterview>);

    vi.mocked(useCandidates.useCandidates).mockReturnValue({
      data: [mockCandidate],
      isLoading: false,
    } as unknown as ReturnType<typeof useCandidates.useCandidates>);

    vi.mocked(useInterviews.useUpdateInterviewNotes).mockReturnValue({
      mutateAsync: updateNotesMock,
      isPending: false,
    } as unknown as ReturnType<typeof useInterviews.useUpdateInterviewNotes>);

    render(<InterviewDetailPage />);

    const textarea = screen.getByDisplayValue("Initial notes");
    const saveButton = screen.getByText("common.save");

    // Initially save button should be disabled because no changes
    expect(saveButton).toBeDisabled();

    // Type new notes
    await userEvent.type(textarea, " updated");

    expect(textarea).toHaveValue("Initial notes updated");
    expect(saveButton).toBeEnabled();

    await userEvent.click(saveButton);

    expect(updateNotesMock).toHaveBeenCalledWith({
      id: "1",
      notes: "Initial notes updated",
    });
  });
});
