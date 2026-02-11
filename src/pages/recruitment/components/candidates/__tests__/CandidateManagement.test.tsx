// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CandidateManagement } from "../CandidateManagement";

// Mock react-pdf
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
  initReactI18next: { type: "3rdParty" },
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

// Mock Router
vi.mock("@/routes/_protected/recruitment", () => ({
  Route: {
    useNavigate: vi.fn(() => vi.fn()),
    useSearch: vi.fn(() => ({})),
  },
}));

// Mock TanStack Query hooks
const mockUpdateCandidateStatus = vi.fn();
vi.mock("@/hooks/queries/useJobs", () => ({
  useJobs: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
}));

vi.mock("@/hooks/queries/useCandidates", () => ({
  useCandidates: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useUpdateCandidateStatus: vi.fn(() => ({
    mutate: mockUpdateCandidateStatus,
  })),
  useCreateCandidate: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
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

  it("renders main layout container", () => {
    const { container } = render(<CandidateManagement />);
    expect(
      container.querySelector(".flex.h-\\[calc\\(100vh-200px\\)\\]"),
    ).toBeInTheDocument();
  });

  it("renders sidebar with job positions title", () => {
    render(<CandidateManagement />);
    expect(
      screen.getByText("recruitment.candidates.sidebar.title"),
    ).toBeInTheDocument();
  });
});
