// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Candidate } from "@/types/candidate";
import { CandidateDetail } from "../CandidateDetail";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
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
  }),
}));

// Mock react-pdf to prevent import errors
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
};

// Mock TanStack Query hooks
vi.mock("@/hooks/queries/useCandidates", () => ({
  CANDIDATES_QUERY_KEY: ["candidates"],
  useCandidates: () => ({
    data: { data: [mockCandidate], meta: { total: 1, page: 1, limit: 10 } },
    isLoading: false,
    isError: false,
  }),
  useUpdateCandidateStatus: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUpdateCandidate: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useDeleteCandidate: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUploadResume: () => ({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  }),
  useCandidateHistory: () => ({
    data: [],
    isLoading: false,
  }),
}));

// Mock useJobs hook
vi.mock("@/hooks/queries/useJobs", () => ({
  useJobs: () => ({
    data: [
      {
        id: "job1",
        title: "Developer",
        department: "Engineering",
        status: "OPEN",
        jobDescription: "Test description",
        headCount: 1,
        openDate: new Date(),
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock(
  "@/pages/recruitment/components/interviews/AssignInterviewerDialog",
  () => ({
    AssignInterviewerDialog: () => (
      <div data-testid="assign-interviewer-dialog" />
    ),
  }),
);

// Mock ResizeObserver
vi.stubGlobal(
  "ResizeObserver",
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof globalThis.ResizeObserver,
);
const renderInDialog = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Dialog open={true}>
        <DialogContent className="max-w-4xl">
          <CandidateDetail candidateId="1" onClose={vi.fn()} />
        </DialogContent>
      </Dialog>
    </QueryClientProvider>,
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
    // The mock returns the translation key as-is
    expect(
      screen.getByText("recruitment.candidates.form.channels.linkedin"),
    ).toBeInTheDocument();
  });
});
