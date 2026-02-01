import axios from "axios";
import type { JobPosition } from "@/types/job";
import type { Candidate, CandidateStatus } from "@/types/candidate";

// Create Axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle dates or errors if needed
api.interceptors.response.use(
  (response) => {
    // Optionally transform date strings to Date objects here if needed globally
    // For now, we'll handle it in specific API methods or rely on string dates until mapped
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const JobsAPI = {
  list: async (): Promise<JobPosition[]> => {
    const response = await api.get<JobPosition[]>("/jobs");
    // specific date transformation if needed, usually backend returns ISO strings
    // which are fine as strings until we need Date methods.
    // The type JobPosition defines openDate as Date, so we should map it.
    return response.data.map((job) => ({
      ...job,
      openDate: new Date(job.openDate),
    }));
  },

  create: async (data: Partial<JobPosition>): Promise<JobPosition> => {
    const response = await api.post<JobPosition>("/jobs", data);
    return {
      ...response.data,
      openDate: new Date(response.data.openDate),
    };
  },

  update: async (
    id: string,
    data: Partial<JobPosition>,
  ): Promise<JobPosition> => {
    const response = await api.put<JobPosition>(`/jobs/${id}`, data);
    return {
      ...response.data,
      openDate: new Date(response.data.openDate),
    };
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  toggleStatus: async (id: string): Promise<JobPosition> => {
    const response = await api.patch<JobPosition>(`/jobs/${id}/status`);
    return {
      ...response.data,
      openDate: new Date(response.data.openDate),
    };
  },
};

export const CandidatesAPI = {
  list: async (jobId?: string): Promise<Candidate[]> => {
    const params = jobId && jobId !== "all" ? { jobId } : {};
    const response = await api.get<Candidate[]>("/candidates", { params });
    return response.data.map((c) => ({
      ...c,
      appliedAt: new Date(c.appliedAt),
    }));
  },

  create: async (data: Partial<Candidate>): Promise<Candidate> => {
    const response = await api.post<Candidate>("/candidates", data);
    return {
      ...response.data,
      appliedAt: new Date(response.data.appliedAt),
    };
  },

  update: async (id: string, data: Partial<Candidate>): Promise<Candidate> => {
    const response = await api.put<Candidate>(`/candidates/${id}`, data);
    return {
      ...response.data,
      appliedAt: new Date(response.data.appliedAt),
    };
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/candidates/${id}`);
  },

  updateStatus: async (
    id: string,
    status: CandidateStatus,
  ): Promise<Candidate> => {
    const response = await api.patch<Candidate>(`/candidates/${id}/status`, {
      status,
    });
    return {
      ...response.data,
      appliedAt: new Date(response.data.appliedAt),
    };
  },

  updateNote: async (id: string, note: string): Promise<Candidate> => {
    const response = await api.patch<Candidate>(`/candidates/${id}/note`, {
      note,
    });
    return {
      ...response.data,
      appliedAt: new Date(response.data.appliedAt),
    };
  },

  uploadResume: async (
    id: string,
    file: File,
  ): Promise<{ resumeUrl: string; candidate: Candidate }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<{
      resumeUrl: string;
      candidate: Candidate;
    }>(`/candidates/${id}/resume`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      resumeUrl: response.data.resumeUrl,
      candidate: {
        ...response.data.candidate,
        appliedAt: new Date(response.data.candidate.appliedAt),
      },
    };
  },
};
