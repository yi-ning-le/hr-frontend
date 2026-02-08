// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Polyfill at the very top, but imports are still hoisted.
// So we must use dynamic import for the component under test.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).DOMMatrix = class DOMMatrix {};

// Mock dependencies
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
}));

// Mock parseResume to avoid importing pdfjs-dist
vi.mock("@/lib/parseResume", () => ({
  parseResume: vi.fn(),
}));

// Mock PdfPreview to avoid loading react-pdf
vi.mock("../PdfPreview", () => ({
  PdfPreview: () => <div data-testid="pdf-preview">PdfPreview</div>,
}));

// Mock dependencies
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
}));

// Mock store
const mockStore = vi.fn();
vi.mock("@/stores/useCandidateStore", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useCandidateStore: (selector: any) => mockStore(selector),
}));

// Mock components
vi.mock("../JobSidebar", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  JobSidebar: ({ jobs, totalCandidates }: any) => (
    <div data-testid="job-sidebar">
      {`Jobs: ${jobs.length}, Total: ${totalCandidates}`}
    </div>
  ),
}));

vi.mock("../CandidateToolbar", () => ({
  CandidateToolbar: () => (
    <div data-testid="candidate-toolbar">CandidateToolbar</div>
  ),
}));

vi.mock("../CandidateList", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CandidateList: ({ candidates }: { candidates: any[] }) => (
    <div data-testid="candidate-list">
      {candidates.map((c) => (
        <div key={c.id} data-testid={`candidate-${c.id}`}>
          {c.name}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../CandidateKanban", () => ({
  CandidateKanban: () => (
    <div data-testid="candidate-kanban">CandidateKanban</div>
  ),
}));

vi.mock("../CandidateDetail", () => ({
  CandidateDetail: () => <div>CandidateDetail</div>,
}));

// Mock hooks
const mockUseJobs = vi.fn();
const mockUseCandidates = vi.fn();

vi.mock("@/hooks/queries/useJobs", () => ({
  useJobs: () => mockUseJobs(),
}));

vi.mock("@/hooks/queries/useCandidates", () => ({
  useCandidates: () => ({ data: mockUseCandidates() }),
  useUpdateCandidateStatus: vi.fn(() => ({ mutate: vi.fn() })),
}));

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe("CandidateManagement Filter Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default store implementation
    mockStore.mockImplementation((selector) =>
      selector({
        selectedJobId: "all",
        searchQuery: "",
        selectedCandidateId: null,
        viewMode: "list",
        statusFilter: [],
        selectCandidate: vi.fn(),
        setSearchQuery: vi.fn(),
        setSelectedJobId: vi.fn(),
        setViewMode: vi.fn(),
        setStatusFilter: vi.fn(),
      }),
    );
  });

  it("should verify that candidates in closed jobs are filtered out", async () => {
    // Setup mock data
    mockUseJobs.mockReturnValue({
      data: [
        { id: "job-open", title: "Open Job", status: "OPEN" },
        { id: "job-closed", title: "Closed Job", status: "CLOSED" },
      ],
      isLoading: false,
    });

    // Directly return the array for useCandidates mock above
    mockUseCandidates.mockReturnValue([
      {
        id: "c1",
        name: "Candidate in Open Job",
        appliedJobId: "job-open",
        status: "new",
        email: "c1@test.com",
      },
      {
        id: "c2",
        name: "Candidate in Closed Job",
        appliedJobId: "job-closed",
        status: "new",
        email: "c2@test.com",
      },
    ]);

    // Dynamic import to ensure polyfills and mocks are applied
    const { CandidateManagement } = await import("../CandidateManagement");

    render(<CandidateManagement />);

    // Verify Candidate 1 is present
    expect(screen.getByTestId("candidate-c1")).toBeInTheDocument();

    // As per requirement, Candidate 2 (in closed job) should NOT be present (Wait, this is the RED test, so currently it IS present)
    // The requirement is to filter it out.
    // TDD: I expect the test to FAIL initially if I assert "not.toBeInTheDocument" and the code is not implemented.
    // However, for reproduction, I want to assert that it IS currently there (or simply run the test asserting it's NOT there and watch it fail).
    // I will assert it is NOT there, so the test fails.
    expect(screen.queryByTestId("candidate-c2")).not.toBeInTheDocument();

    // Verify Sidebar stats: Should only have 1 open job and 1 candidate (Candidate 1)
    // Currently, it will fail because we are passing all jobs and using all candidates for counts
    expect(screen.getByTestId("job-sidebar")).toHaveTextContent(
      "Jobs: 1, Total: 1",
    );
  });
});
