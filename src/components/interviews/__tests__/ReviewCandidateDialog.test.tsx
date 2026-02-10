import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CandidatesAPI } from "@/lib/api";
import { ReviewCandidateDialog } from "../ReviewCandidateDialog";

// Mock dependencies
vi.mock("@/lib/api", () => ({
  CandidatesAPI: {
    review: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string | object, options?: any) => {
      // Handle overload where defaultValue is options (if explicit default value omitted)
      if (typeof defaultValue === "object") {
        options = defaultValue;
        defaultValue = key;
      }

      let result =
        (typeof defaultValue === "string" ? defaultValue : key) || key;

      if (options) {
        Object.keys(options).forEach((k) => {
          result = result.replace(`{{${k}}}`, options[k]);
        });
      }
      return result;
    },
  }),
}));
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ReviewCandidateDialog", () => {
  const mockCandidate = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    position: "Developer",
    status: "new",
    appliedAt: new Date().toISOString(),
  } as any;

  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly when open", () => {
    render(
      <ReviewCandidateDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    expect(screen.getByText("Review Candidate")).toBeInTheDocument();
    expect(
      screen.getByText(/Provide your feedback for John Doe/),
    ).toBeInTheDocument();
    expect(screen.getByText("Decision")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
  });

  it("should submit review successfully", async () => {
    render(
      <ReviewCandidateDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    const user = userEvent.setup();

    // Select suitable (default is suitable, but let's confirm or change)
    // The select implementation in shadcn/ui uses trigger and content.
    // Default value logic in component:
    // defaultValues: { reviewStatus: "suitable", ... }

    // Add a note
    const noteInput = screen.getByPlaceholderText("Add any comments here...");
    await user.type(noteInput, "Great candidate!");

    // Submit
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(CandidatesAPI.review).toHaveBeenCalledWith(
        "1",
        "suitable",
        "Great candidate!",
      );
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("should handle submission error", async () => {
    const error = new Error("Failed");
    (CandidatesAPI.review as any).mockRejectedValueOnce(error);

    render(
      <ReviewCandidateDialog
        candidate={mockCandidate}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(CandidatesAPI.review).toHaveBeenCalled();
    });

    // Expect toast error (mocked) or error logging
    // Here we check if dialog stays open
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });
});
