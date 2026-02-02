import { describe, it, expect, vi, beforeEach } from "vitest";
import { useJobStore } from "../useJobStore";
import { JobsAPI } from "@/lib/api";
import type { JobPosition } from "@/types/job";
import type { JobFormValues } from "@/pages/recruitment/components/jobs/forms/JobPositionForm";

vi.mock("@/lib/api", () => ({
  JobsAPI: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    toggleStatus: vi.fn(),
  },
}));

describe("useJobStore", () => {
  const mockJob: JobPosition = {
    id: "1",
    title: "Software Engineer",
    department: "Engineering",
    headCount: 2,
    openDate: new Date("2023-01-01"),
    jobDescription: "Description of the job",
    note: "Initial note",
    status: "OPEN",
  };

  beforeEach(() => {
    useJobStore.setState({
      jobs: [],
      isLoading: false,
      error: null,
      isAddDialogOpen: false,
    });
    vi.clearAllMocks();
  });

  describe("fetchJobs", () => {
    it("should fetch and set jobs", async () => {
      vi.mocked(JobsAPI.list).mockResolvedValue([mockJob]);

      await useJobStore.getState().fetchJobs();

      expect(useJobStore.getState().jobs).toHaveLength(1);
      expect(useJobStore.getState().jobs[0]).toEqual(mockJob);
      expect(useJobStore.getState().isLoading).toBe(false);
    });
  });

  describe("addJob", () => {
    it("should add a new job", async () => {
      const newJobData: JobFormValues = {
        title: "Product Manager",
        department: "Product",
        headCount: 1,
        openDate: new Date("2023-01-02"),
        jobDescription: "Product manager description",
        status: "OPEN",
      };
      const createdJob: JobPosition = { ...mockJob, ...newJobData, id: "2" };

      vi.mocked(JobsAPI.create).mockResolvedValue(createdJob);

      await useJobStore.getState().addJob(newJobData);

      expect(useJobStore.getState().jobs).toContainEqual(createdJob);
      expect(useJobStore.getState().isAddDialogOpen).toBe(false);
    });
  });

  describe("updateJob", () => {
    it("should update job", async () => {
      useJobStore.setState({ jobs: [mockJob] });
      const updatedJob = { ...mockJob, title: "Senior Software Engineer" };

      const updateData: JobFormValues = {
        title: "Senior Software Engineer",
        department: mockJob.department,
        headCount: mockJob.headCount,
        openDate: mockJob.openDate,
        jobDescription: mockJob.jobDescription,
        status: mockJob.status,
      };

      vi.mocked(JobsAPI.update).mockResolvedValue(updatedJob);

      await useJobStore.getState().updateJob(mockJob.id, updateData);

      expect(useJobStore.getState().jobs[0].title).toBe(
        "Senior Software Engineer",
      );
    });
  });

  describe("deleteJob", () => {
    it("should delete job", async () => {
      useJobStore.setState({ jobs: [mockJob] });

      vi.mocked(JobsAPI.delete).mockResolvedValue(undefined);

      await useJobStore.getState().deleteJob(mockJob.id);

      expect(useJobStore.getState().jobs).toHaveLength(0);
    });
  });
});
