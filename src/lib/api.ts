import axios from "axios";
import type { JobPosition } from "@/types/job";
import type {
  Candidate,
  CandidateStatus,
  CandidateStatusDefinition,
} from "@/types/candidate"; // CandidateStatus is string, Definition is object

// Create Axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
let authToken: string | null = null;
let unauthorizedCallback: () => void = () => {};

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const setUnauthorizedCallback = (callback: () => void) => {
  unauthorizedCallback = callback;
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Exclude public auth endpoints from token attachment
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register")
    ) {
      return config;
    }

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle dates or errors if needed
api.interceptors.response.use(
  (response) => {
    // Optionally transform date strings to Date objects here if needed globally
    // For now, we'll handle it in specific API methods or rely on string dates until mapped
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      unauthorizedCallback();
    }
    return Promise.reject(error);
  },
);

export const AuthAPI = {
  login: async (
    data: unknown,
  ): Promise<{ token: string; user: { id: string; username: string } }> => {
    const response = await api.post<{
      token: string;
      user: { id: string; username: string };
    }>("/auth/login", data);
    return response.data;
  },

  register: async (
    data: unknown,
  ): Promise<{ id: string; username: string; email: string }> => {
    const response = await api.post<{
      id: string;
      username: string;
      email: string;
    }>("/auth/register", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};

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

// Employee Types for API
interface EmployeeAPIResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: string;
  employmentType: string;
  joinDate: string;
  managerId?: string;
  userId?: string;
}

interface EmployeeListAPIResponse {
  employees: EmployeeAPIResponse[];
  total: number;
  page: number;
  limit: number;
}

export const EmployeesAPI = {
  list: async (
    params: {
      status?: string;
      department?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<EmployeeListAPIResponse> => {
    const response = await api.get<EmployeeListAPIResponse>("/employees", {
      params,
    });
    return {
      ...response.data,
      employees: response.data.employees.map((e) => ({
        ...e,
        joinDate: e.joinDate,
      })),
    };
  },

  get: async (id: string): Promise<EmployeeAPIResponse> => {
    const response = await api.get<EmployeeAPIResponse>(`/employees/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<EmployeeAPIResponse, "id">,
  ): Promise<EmployeeAPIResponse> => {
    const response = await api.post<EmployeeAPIResponse>("/employees", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Omit<EmployeeAPIResponse, "id">,
  ): Promise<EmployeeAPIResponse> => {
    const response = await api.put<EmployeeAPIResponse>(
      `/employees/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};

export const CandidateStatusesAPI = {
  list: async (): Promise<CandidateStatusDefinition[]> => {
    const response = await api.get<CandidateStatusDefinition[]>(
      "/candidate-statuses",
    );
    return response.data;
  },

  create: async (
    name: string,
    color: string,
  ): Promise<CandidateStatusDefinition> => {
    const response = await api.post<CandidateStatusDefinition>(
      "/candidate-statuses",
      {
        name,
        color,
      },
    );
    return response.data;
  },

  update: async (
    id: string,
    name: string,
    color: string,
  ): Promise<CandidateStatusDefinition> => {
    const response = await api.put<CandidateStatusDefinition>(
      `/candidate-statuses/${id}`,
      {
        name,
        color,
      },
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/candidate-statuses/${id}`);
  },

  reorder: async (ids: string[]): Promise<void> => {
    await api.patch("/candidate-statuses/reorder", { ids });
  },
};
