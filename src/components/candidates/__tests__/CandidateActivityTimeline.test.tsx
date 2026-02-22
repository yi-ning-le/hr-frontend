// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCandidateHistory } from "@/hooks/queries/useCandidates";
import { CandidateActivityTimeline } from "../CandidateActivityTimeline";

// Mock the hook
vi.mock("@/hooks/queries/useCandidates", () => ({
  useCandidateHistory: vi.fn(),
}));

// react-i18next is already mocked globally in src/test/i18n-mock.ts
// so we don't need to mock it here again, which avoids the double mocking issues

describe("CandidateActivityTimeline", () => {
  it("shows a loading spinner when loading", () => {
    (useCandidateHistory as any).mockReturnValue({
      isLoading: true,
      data: undefined,
    });

    render(<CandidateActivityTimeline candidateId="doc1" />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("displays a message when there is no history", () => {
    (useCandidateHistory as any).mockReturnValue({
      isLoading: false,
      data: [],
    });

    render(<CandidateActivityTimeline candidateId="doc1" />);

    expect(
      screen.getByText("recruitment.candidates.history.empty"),
    ).toBeInTheDocument();
  });

  it("renders a list of past applications/reviews", () => {
    (useCandidateHistory as any).mockReturnValue({
      isLoading: false,
      data: [
        {
          candidateId: "past1",
          candidateName: "John Doe",
          status: "rejected",
          reviewStatus: "unsuitable",
          appliedAt: "2023-01-01T10:00:00Z",
          jobTitle: "Frontend Engineer",
        },
      ],
    });

    render(<CandidateActivityTimeline candidateId="doc1" />);

    expect(screen.getByText(/Frontend Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/unsuitable/i)).toBeInTheDocument();
    expect(screen.getByText(/2023/i)).toBeInTheDocument();
  });
});
