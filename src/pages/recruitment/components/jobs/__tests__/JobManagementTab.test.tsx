// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
  JobPositionList: ({
    onEdit,
  }: {
    onEdit: (job: { id: string; title: string }) => void;
  }) => (
    <div data-testid="job-list">
      <button onClick={() => onEdit({ id: "1", title: "Test Job" })}>
        Edit Job
      </button>
    </div>
  ),
}));

vi.mock("../JobDialogs", () => ({
  JobDialogs: ({
    isDialogOpen,
    handleSaveJob,
  }: {
    isDialogOpen: boolean;
    handleSaveJob: (data: { title: string }) => void;
  }) => (
    <div data-testid="job-dialogs">
      {isDialogOpen && <div data-testid="dialog-open">Dialog Open</div>}
      <button onClick={() => handleSaveJob({ title: "New Job" })}>
        Save Job
      </button>
    </div>
  ),
}));

// Mock useJobStore
vi.mock("@/stores/useJobStore", () => ({
  useJobStore: vi.fn(() => ({
    isAddDialogOpen: false,
    setIsAddDialogOpen: vi.fn(),
  })),
}));

// Mock TanStack Query hooks
vi.mock("@/hooks/queries/useJobs", () => ({
  useJobs: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useCreateJob: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useUpdateJob: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useDeleteJob: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useToggleJobStatus: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

vi.mock("@/hooks/queries/useCandidates", () => ({
  useCandidates: vi.fn(() => ({
    data: { data: [], meta: { total: 0, page: 1, limit: 50 } },
    isLoading: false,
  })),
  useCandidateCounts: vi.fn(() => ({
    data: {},
    isLoading: false,
  })),
}));

describe("JobManagementTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders JobPositionList and JobDialogs", () => {
    render(<JobManagementTab />);
    expect(screen.getByTestId("job-list")).toBeInTheDocument();
    expect(screen.getByTestId("job-dialogs")).toBeInTheDocument();
  });
});
