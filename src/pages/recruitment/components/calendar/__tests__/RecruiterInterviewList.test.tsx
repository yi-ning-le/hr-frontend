import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecruiterInterviewList } from "../RecruiterInterviewList";

// Mock RecruiterInterviewCard
vi.mock("../RecruiterInterviewCard", () => ({
  RecruiterInterviewCard: ({ interview, candidate }: any) => (
    <div data-testid="interview-card">
      {interview.id} - {candidate?.name || "Unknown"}
    </div>
  ),
}));

describe("RecruiterInterviewList", () => {
  const emptyProps = {
    interviews: [],
    candidatesById: new Map(),
    onPreviewResume: vi.fn(),
    emptyTitle: "Empty Title",
    emptyDesc: "Empty Description",
  };

  it("renders empty state when no interviews", () => {
    render(<RecruiterInterviewList {...emptyProps} />);
    expect(screen.getByText("Empty Title")).toBeDefined();
    expect(screen.getByText("Empty Description")).toBeDefined();
  });

  it("renders list of cards when interviews exist", () => {
    const mockInterviews = [
      { id: "1", candidateId: "c1" } as any,
      { id: "2", candidateId: "c2" } as any,
    ];
    const mockCandidates = new Map([
      ["c1", { name: "Alice" } as any],
      ["c2", { name: "Bob" } as any],
    ]);

    render(
      <RecruiterInterviewList
        {...emptyProps}
        interviews={mockInterviews}
        candidatesById={mockCandidates}
      />,
    );

    expect(screen.getAllByTestId("interview-card")).toHaveLength(2);
    expect(screen.getByText("1 - Alice")).toBeDefined();
    expect(screen.getByText("2 - Bob")).toBeDefined();
  });
});
