// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { CandidateList } from "../CandidateList";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock child components
vi.mock("../CandidateCard", () => ({
  CandidateCard: ({ candidate }: { candidate: Candidate }) => (
    <div data-testid="candidate-card">{candidate.name}</div>
  ),
}));

const mockCandidates: Candidate[] = [
  { id: "1", name: "John Doe", status: "new" } as Candidate,
  { id: "2", name: "Jane Smith", status: "screening" } as Candidate,
];

describe("CandidateList", () => {
  it("renders empty state when no candidates", () => {
    render(<CandidateList candidates={[]} onCandidateClick={vi.fn()} />);

    // Correct translation key from component
    expect(screen.queryByTestId("candidate-card")).not.toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.list.noResults"),
    ).toBeInTheDocument();
  });

  it("renders list of candidates", () => {
    render(
      <CandidateList candidates={mockCandidates} onCandidateClick={vi.fn()} />,
    );

    expect(screen.getAllByTestId("candidate-card")).toHaveLength(2);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });
});
