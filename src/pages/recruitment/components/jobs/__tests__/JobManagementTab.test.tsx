import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { JobManagementTab } from "../JobManagementTab";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock child components
vi.mock("../JobPositionList", () => ({
  JobPositionList: ({ onEdit }: { onEdit: (job: { id: string; title: string }) => void }) => (
    <div data-testid="job-list">
      <button onClick={() => onEdit({ id: "1", title: "Test Job" })}>Edit Job</button>
    </div>
  ),
}));

vi.mock("../JobDialogs", () => ({
  JobDialogs: ({ isDialogOpen, handleSaveJob }: { isDialogOpen: boolean; handleSaveJob: (data: { title: string }) => void }) => (
    <div data-testid="job-dialogs">
      {isDialogOpen && <div data-testid="dialog-open">Dialog Open</div>}
      <button onClick={() => handleSaveJob({ title: "New Job" })}>Save Job</button>
    </div>
  ),
}));

// Mock stores
const mockFetchJobs = vi.fn();
const mockFetchCandidates = vi.fn();
const mockAddJob = vi.fn();
const mockUpdateJob = vi.fn();
const mockDeleteJob = vi.fn();
const mockToggleJobStatus = vi.fn();
const mockSetIsAddDialogOpen = vi.fn();

vi.mock("@/stores/useJobStore", () => ({
  useJobStore: () => ({
    jobs: [],
    addJob: mockAddJob,
    updateJob: mockUpdateJob,
    deleteJob: mockDeleteJob,
    toggleJobStatus: mockToggleJobStatus,
    isAddDialogOpen: false,
    setIsAddDialogOpen: mockSetIsAddDialogOpen,
    fetchJobs: mockFetchJobs,
  }),
}));

vi.mock("@/stores/useCandidateStore", () => ({
  useCandidateStore: () => ({
    candidates: [],
    fetchCandidates: mockFetchCandidates,
  }),
}));

describe("JobManagementTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches jobs and candidates on mount", () => {
    render(<JobManagementTab />);

    expect(mockFetchJobs).toHaveBeenCalledTimes(1);
    expect(mockFetchCandidates).toHaveBeenCalledTimes(1);
  });

  it("renders JobPositionList and JobDialogs", () => {
    render(<JobManagementTab />);

    expect(screen.getByTestId("job-list")).toBeInTheDocument();
    expect(screen.getByTestId("job-dialogs")).toBeInTheDocument();
  });
});
