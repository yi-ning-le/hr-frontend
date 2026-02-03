
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CandidateDetail } from "../CandidateDetail";
import type { Candidate } from "@/types/candidate";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock react-pdf to prevent import errors
vi.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" } },
  Document: ({ children }: { children?: React.ReactNode }) => <div data-testid="pdf-document">{children}</div>,
  Page: () => <div data-testid="pdf-page">Page</div>,
}));

// Mock parseResume  
vi.mock("@/lib/parseResume", () => ({
  parseResume: vi.fn().mockResolvedValue({ name: "Parsed" }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockCandidate: Candidate = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  experienceYears: 5,
  education: "Bachelor",
  appliedJobId: "job1",
  appliedJobTitle: "Developer",
  channel: "LinkedIn",
  resumeUrl: "resume.pdf",
  status: "new",
  appliedAt: new Date("2024-01-01"),
  note: "Good candidate",
};

// Mock stores with selectors pattern
interface CandidateStoreState {
  selectedCandidateId: string;
  candidates: Candidate[];
  updateCandidateStatus: ReturnType<typeof vi.fn>;
  updateCandidateNote: ReturnType<typeof vi.fn>;
  updateCandidate: ReturnType<typeof vi.fn>;
  removeCandidate: ReturnType<typeof vi.fn>;
  selectCandidate: ReturnType<typeof vi.fn>;
  uploadResume: ReturnType<typeof vi.fn>;
}

vi.mock("@/stores/useCandidateStore", () => ({
  useCandidateStore: <T,>(selector: (state: CandidateStoreState) => T): T => {
    const state: CandidateStoreState = {
      selectedCandidateId: "1",
      candidates: [mockCandidate],
      updateCandidateStatus: vi.fn(),
      updateCandidateNote: vi.fn(),
      updateCandidate: vi.fn(),
      removeCandidate: vi.fn(),
      selectCandidate: vi.fn(),
      uploadResume: vi.fn().mockResolvedValue(undefined),
    };
    return selector(state);
  },
}));

interface JobStoreState {
  jobs: Array<{ id: string; title: string; department: string; status: string; jobDescription?: string; headCount?: number; openDate?: Date }>;
  fetchJobs: ReturnType<typeof vi.fn>;
  isLoading: boolean;
}

vi.mock("@/stores/useJobStore", () => ({
  useJobStore: <T,>(selector?: (state: JobStoreState) => T): T | JobStoreState => {
    const state: JobStoreState = {
      jobs: [{ id: "job1", title: "Developer", department: "Engineering", status: "OPEN", jobDescription: "Test description", headCount: 1, openDate: new Date() }],
      fetchJobs: vi.fn(),
      isLoading: false,
    };
    // Handle both selector and non-selector usage
    return selector ? selector(state) : state;
  },
}));

// Mock ResizeObserver
vi.stubGlobal('ResizeObserver', class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
} as typeof globalThis.ResizeObserver);

// Helper to render with Dialog context
const renderInDialog = () => {
  return render(
    <Dialog open={true}>
      <DialogContent className="max-w-4xl">
        <CandidateDetail />
      </DialogContent>
    </Dialog>
  );
};

describe("CandidateDetail", () => {
  it("renders candidate name and job title", () => {
    renderInDialog();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("renders candidate contact information", () => {
    renderInDialog();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
  });

  it("renders candidate channel badge", () => {
    renderInDialog();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
  });
});
