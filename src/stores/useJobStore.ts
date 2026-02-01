import { create } from "zustand";
import type { JobPosition } from "@/types/job";
import type { JobFormValues } from "@/pages/recruitment/components/jobs/forms/JobPositionForm";

import { JobsAPI } from "@/lib/api";

interface JobState {
  jobs: JobPosition[];
  isAddDialogOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchJobs: () => Promise<void>;
  setJobs: (jobs: JobPosition[]) => void;
  addJob: (data: JobFormValues) => Promise<void>;
  updateJob: (id: string, data: JobFormValues) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  toggleJobStatus: (id: string) => Promise<void>;
  setIsAddDialogOpen: (isOpen: boolean) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  isAddDialogOpen: false,
  isLoading: false,
  error: null,

  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const jobs = await JobsAPI.list();
      set({ jobs, isLoading: false });
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to fetch jobs", isLoading: false });
    }
  },

  setJobs: (jobs) => set({ jobs }),

  addJob: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newJob = await JobsAPI.create(data);
      set((state) => ({
        jobs: [newJob, ...state.jobs],
        isAddDialogOpen: false,
        isLoading: false,
      }));
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to create job", isLoading: false });
    }
  },

  updateJob: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedJob = await JobsAPI.update(id, data);
      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? updatedJob : job)),
        isLoading: false,
      }));
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to update job", isLoading: false });
    }
  },

  deleteJob: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await JobsAPI.delete(id);
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        isLoading: false,
      }));
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to delete job", isLoading: false });
    }
  },

  toggleJobStatus: async (id) => {
    try {
      const updatedJob = await JobsAPI.toggleStatus(id);
      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? updatedJob : job)),
      }));
    } catch (_error) {
      // Optimistic update revert or error handling could go here
      console.error("Failed to toggle status", _error);
    }
  },

  setIsAddDialogOpen: (isOpen) => set({ isAddDialogOpen: isOpen }),
}));
