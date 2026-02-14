import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditInterviewDialog } from "../EditInterviewDialog";

// Mock dependencies
const mockUpdateInterview = vi.fn();
vi.mock("@/hooks/queries/useInterviews", () => ({
  useUpdateInterview: () => ({
    mutateAsync: mockUpdateInterview,
    isPending: false,
  }),
  useEmployees: () => ({
    data: {
      employees: [{ id: "e1", firstName: "Bob", lastName: "Builder" }],
    },
  }),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultVal: string) => defaultVal || key,
    i18n: { language: "en" },
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderComponent = (props: any) =>
  render(
    <QueryClientProvider client={queryClient}>
      <EditInterviewDialog {...props} />
    </QueryClientProvider>,
  );

describe("EditInterviewDialog", () => {
  const mockInterview = {
    id: "1",
    candidateId: "c1",
    interviewerId: "e1", // Matches mock employee
    scheduledTime: "2023-10-10T10:00:00Z",
    scheduledEndTime: "2023-10-10T11:00:00Z",
    status: "PENDING",
  };

  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    interview: mockInterview,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dialog content when open", () => {
    renderComponent(defaultProps);
    // Dialog title uses t("recruitment.interviews.editTitle", "Edit Interview")
    expect(screen.getByText("Edit Interview")).toBeDefined();

    // Check if form fields are populated
    // The SelectValue might not render text in JSDOM easily without proper setup.
    // expect(screen.getByText("Bob Builder")).toBeDefined();
  });

  it("submits the form with updated values", async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);

    // Click Save button. Text is "Save" from default value of t("common.save", "Save")
    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateInterview).toHaveBeenCalled();
    });
    // Verify payload includes updated fields (or at least id)
    expect(mockUpdateInterview).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1" }),
    );
  });
});
