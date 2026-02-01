import { create } from "zustand";
import type { JobPosition } from "@/types/job";
import type { JobFormValues } from "@/pages/recruitment/components/jobs/forms/JobPositionForm";

// Mock initial data
const INITIAL_JOBS: JobPosition[] = [
  {
    id: "1",
    title: "高级前端工程师",
    department: "产品研发部",
    headCount: 2,
    openDate: new Date("2024-05-01"),
    jobDescription: "负责公司核心产品的前端研发工作...",
    note: "优先考虑有React经验的候选人",
    status: "OPEN",
  },
  {
    id: "2",
    title: "产品经理",
    department: "产品部",
    headCount: 1,
    openDate: new Date("2024-05-15"),
    jobDescription: "负责产品规划和设计...",
    note: "",
    status: "OPEN",
  },
];

interface JobState {
  jobs: JobPosition[];
  isAddDialogOpen: boolean;

  // Actions
  setJobs: (jobs: JobPosition[]) => void;
  addJob: (data: JobFormValues) => void;
  updateJob: (id: string, data: JobFormValues) => void;
  deleteJob: (id: string) => void;
  toggleJobStatus: (id: string) => void;
  setIsAddDialogOpen: (isOpen: boolean) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: INITIAL_JOBS,
  isAddDialogOpen: false,

  setJobs: (jobs) => set({ jobs }),

  addJob: (data) =>
    set((state) => {
      const newJob: JobPosition = {
        ...data,
        id: Math.random().toString(36).slice(2, 9),
        status: data.status || "OPEN",
      };
      return { jobs: [newJob, ...state.jobs], isAddDialogOpen: false };
    }),

  updateJob: (id, data) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...data } : job,
      ),
    })),

  deleteJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    })),

  toggleJobStatus: (id) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id
          ? { ...job, status: job.status === "OPEN" ? "CLOSED" : "OPEN" }
          : job,
      ),
    })),

  setIsAddDialogOpen: (isOpen) => set({ isAddDialogOpen: isOpen }),
}));
