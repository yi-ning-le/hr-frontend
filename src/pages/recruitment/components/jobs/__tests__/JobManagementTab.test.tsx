// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobManagementTab } from "../JobManagementTab";

const mockSetIsAddDialogOpen = vi.fn();
const mockAddJob = vi.fn();
const mockUpdateJob = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue ?? key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../JobPositionList", () => ({
  JobPositionList: ({
    onEdit,
  }: {
    onEdit: (job: {
      id: string;
      title: string;
      department: string;
      headCount: number;
      openDate: Date;
      jobDescription: string;
      status: "OPEN" | "CLOSED";
    }) => void;
  }) => (
    <div data-testid="job-list">
      <button
        onClick={() =>
          onEdit({
            id: "1",
            title: "Test Job",
            department: "Engineering",
            headCount: 1,
            openDate: new Date("2025-01-01"),
            jobDescription: "test job description",
            status: "OPEN",
          })
        }
      >
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
    handleSaveJob: (data: {
      title: string;
      department: string;
      headCount: number;
      openDate: Date;
      jobDescription: string;
      status: "OPEN" | "CLOSED";
    }) => Promise<void>;
  }) => (
    <div data-testid="job-dialogs">
      {isDialogOpen && <div data-testid="dialog-open">Dialog Open</div>}
      <button
        onClick={() =>
          handleSaveJob({
            title: "Updated Job",
            department: "Engineering",
            headCount: 2,
            openDate: new Date("2025-01-02"),
            jobDescription: "updated job description",
            status: "OPEN",
          })
        }
      >
        Save Job
      </button>
    </div>
  ),
}));

vi.mock("@/stores/useJobStore", () => ({
  useJobStore: vi.fn(() => ({
    isAddDialogOpen: true,
    setIsAddDialogOpen: mockSetIsAddDialogOpen,
  })),
}));

vi.mock("@/hooks/queries/useJobs", () => ({
  useJobs: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useCreateJob: vi.fn(() => ({
    mutateAsync: mockAddJob,
  })),
  useUpdateJob: vi.fn(() => ({
    mutateAsync: mockUpdateJob,
  })),
  useDeleteJob: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useToggleJobStatus: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

vi.mock("@/hooks/queries/useCandidates", () => ({
  useCandidateCounts: vi.fn(() => ({
    data: {},
    isLoading: false,
  })),
}));

describe("JobManagementTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddJob.mockResolvedValue(undefined);
    mockUpdateJob.mockResolvedValue(undefined);
  });

  it("renders JobPositionList and JobDialogs", () => {
    render(<JobManagementTab />);
    expect(screen.getByTestId("job-list")).toBeInTheDocument();
    expect(screen.getByTestId("job-dialogs")).toBeInTheDocument();
  });

  it("keeps dialog open and shows error when saving edited job fails", async () => {
    mockUpdateJob.mockRejectedValueOnce(new Error("save failed"));
    render(<JobManagementTab />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Edit Job" }));
    await user.click(screen.getByRole("button", { name: "Save Job" }));

    await waitFor(() => {
      expect(mockUpdateJob).toHaveBeenCalledWith({
        id: "1",
        data: expect.objectContaining({ title: "Updated Job" }),
      });
    });

    expect(mockSetIsAddDialogOpen).not.toHaveBeenCalledWith(false);
    expect(toast.error).toHaveBeenCalled();
  });
});
