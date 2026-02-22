// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CandidateReviewPanel } from "@/components/candidates/reviews/CandidateReviewPanel";
import type { Candidate } from "@/types/candidate";

vi.mock("@/hooks/queries/useCandidateComments", () => ({
  useCandidateComments: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useAddCandidateComment: vi.fn(() => ({
    mutateAsync: vi.fn(),
  })),
}));

vi.mock("@/lib/api", () => ({
  CandidatesAPI: {
    review: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: "user-1", name: "Test User" },
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockCandidate: Candidate = {
  id: "candidate-1",
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  experienceYears: 5,
  education: "Bachelor",
  appliedJobId: "job-1",
  appliedJobTitle: "Frontend Developer",
  channel: "LinkedIn",
  resumeUrl: "https://example.com/resume.pdf",
  status: "new",
  appliedAt: new Date("2025-01-01T00:00:00.000Z"),
};

describe("CandidateReviewPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders review buttons", () => {
    render(<CandidateReviewPanel candidate={mockCandidate} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getAllByText(/candidate\.unsuitable/).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText(/candidate\.suitable/).length).toBeGreaterThan(
      0,
    );
  });

  it("renders review actions section", () => {
    render(<CandidateReviewPanel candidate={mockCandidate} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getAllByText(/candidate\.reviewActions/).length,
    ).toBeGreaterThan(0);
  });

  it("renders comments section heading", () => {
    render(<CandidateReviewPanel candidate={mockCandidate} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getAllByText(/recruitment\.candidates\.comments\.title/).length,
    ).toBeGreaterThan(0);
  });

  it("renders main container", () => {
    const { container } = render(
      <CandidateReviewPanel candidate={mockCandidate} />,
      { wrapper: createWrapper() },
    );

    expect(container.querySelector(".flex.flex-col")).toBeInTheDocument();
  });
});
