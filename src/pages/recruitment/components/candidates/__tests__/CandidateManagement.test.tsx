// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CandidateManagement } from "../CandidateManagement";

// Mock react-pdf before it imports pdfjs-dist
vi.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" } },
  Document: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="pdf-document">{children}</div>
  ),
  Page: () => <div data-testid="pdf-page">Page</div>,
}));

// Mock parseResume
vi.mock("@/lib/parseResume", () => ({
  parseResume: vi.fn().mockResolvedValue({ name: "Parsed" }),
}));

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

vi.mock("@/hooks/useCandidateStatuses", () => ({
  useCandidateStatuses: () => ({
    statuses: [
      { id: "1", slug: "new", name: "New", type: "system", color: "#000000" },
    ],
    statusMap: {
      new: {
        id: "1",
        slug: "new",
        name: "New",
        type: "system",
        color: "#000000",
      },
    },
    fetchStatuses: vi.fn(),
  }),
}));

// Mock stores
const mockFetchCandidates = vi.fn();
const mockFetchJobs = vi.fn();

interface CandidateMgmtStoreState {
  candidates: never[];
  selectedJobId: string;
  searchQuery: string;
  selectedCandidateId: null;
  viewMode: string;
  statusFilter: never[];
  updateCandidateStatus: ReturnType<typeof vi.fn>;
  selectCandidate: ReturnType<typeof vi.fn>;
  setSearchQuery: ReturnType<typeof vi.fn>;
  setSelectedJobId: ReturnType<typeof vi.fn>;
  setViewMode: ReturnType<typeof vi.fn>;
  setStatusFilter: ReturnType<typeof vi.fn>;
  fetchCandidates: ReturnType<typeof vi.fn>;
}

vi.mock("@/stores/useCandidateStore", () => ({
  useCandidateStore: <T,>(
    selector: (state: CandidateMgmtStoreState) => T,
  ): T => {
    const state: CandidateMgmtStoreState = {
      candidates: [],
      selectedJobId: "all",
      searchQuery: "",
      selectedCandidateId: null,
      viewMode: "list",
      statusFilter: [],
      updateCandidateStatus: vi.fn(),
      selectCandidate: vi.fn(),
      setSearchQuery: vi.fn(),
      setSelectedJobId: vi.fn(),
      setViewMode: vi.fn(),
      setStatusFilter: vi.fn(),
      fetchCandidates: mockFetchCandidates,
    };
    return selector(state);
  },
}));

interface JobMgmtStoreState {
  jobs: never[];
  fetchJobs: ReturnType<typeof vi.fn>;
}

vi.mock("@/stores/useJobStore", () => ({
  useJobStore: <T,>(selector: (state: JobMgmtStoreState) => T): T => {
    const state: JobMgmtStoreState = {
      jobs: [],
      fetchJobs: mockFetchJobs,
    };
    return selector(state);
  },
}));

// Mock ResizeObserver
vi.stubGlobal(
  "ResizeObserver",
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof globalThis.ResizeObserver,
);

describe("CandidateManagement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches data on mount", () => {
    render(<CandidateManagement />);
    expect(mockFetchCandidates).toHaveBeenCalled();
    expect(mockFetchJobs).toHaveBeenCalled();
  });

  it("renders main layout container", () => {
    const { container } = render(<CandidateManagement />);
    // Check that the main container is rendered
    expect(
      container.querySelector(".flex.h-\\[calc\\(100vh-200px\\)\\]"),
    ).toBeInTheDocument();
  });

  it("renders sidebar with job positions title", () => {
    render(<CandidateManagement />);
    // The sidebar title should be visible
    expect(
      screen.getByText("recruitment.candidates.sidebar.title"),
    ).toBeInTheDocument();
  });
});
