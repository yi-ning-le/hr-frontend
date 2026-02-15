import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { z } from "zod";
import type { RegisterInput } from "@/types/auth";
import type {
  Candidate,
  CandidateComment,
  CandidateJobsCount,
  CandidateListResponse,
  CandidateStatus,
  CandidateStatusDefinition,
} from "@/types/candidate"; // CandidateStatus is string, Definition is object
import type { JobPosition } from "@/types/job";
import type {
  CreateInterviewInput,
  Interview,
  InterviewListResult,
} from "@/types/recruitment.d";

// Create Axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token and Session storage keys
const AUTH_TOKEN_KEY = "hr_auth_token";
const SESSION_ID_KEY = "hr_session_id";

// Subscription mechanism for in-memory state synchronization
type AuthChangeSubscriber = (auth: {
  token: string | null;
  sessionId: string | null;
}) => void;
let authChangeSubscriber: AuthChangeSubscriber | null = null;

export const onAuthChange = (subscriber: AuthChangeSubscriber) => {
  authChangeSubscriber = subscriber;
};

// Helper functions for storage
const getStoredToken = () => sessionStorage.getItem(AUTH_TOKEN_KEY);
const getStoredSessionId = () => sessionStorage.getItem(SESSION_ID_KEY);

const setStoredAuth = (token: string | null, sessionId: string | null) => {
  if (token) sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  else sessionStorage.removeItem(AUTH_TOKEN_KEY);

  if (sessionId) sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  else sessionStorage.removeItem(SESSION_ID_KEY);

  // Notify subscribers (like useAuthStore) to update in-memory state
  if (authChangeSubscriber) {
    authChangeSubscriber({ token, sessionId });
  }
};

let unauthorizedCallback: () => void = () => {};

export const setAuthToken = (token: string | null) => {
  if (token) sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  else sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

export const setSessionId = (sid: string | null) => {
  if (sid) sessionStorage.setItem(SESSION_ID_KEY, sid);
  else sessionStorage.removeItem(SESSION_ID_KEY);
};

export const getSessionId = () => getStoredSessionId();

export const setUnauthorizedCallback = (callback: () => void) => {
  unauthorizedCallback = callback;
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Exclude public auth endpoints from token attachment
    const isPublic =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/refresh-token");

    if (isPublic) return config;

    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Concurrency management for token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const status = error.response?.status;
    const isRefreshUrl = originalRequest?.url?.includes("/auth/refresh-token");
    const sessionId = getStoredSessionId();

    // Early return: not a 401, or already retried, or no session, or it's the refresh request itself failing
    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshUrl ||
      !sessionId
    ) {
      if (status === 401) unauthorizedCallback();
      return Promise.reject(error);
    }

    // Handle concurrent refresh requests
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await AuthAPI.refreshToken(sessionId);
      const { token, sessionId: newSessionId } = response;

      setStoredAuth(token, newSessionId);
      processQueue(null, token);

      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      const refreshStatus = (refreshError as { response?: { status?: number } })
        ?.response?.status;

      if (refreshStatus === 401 || refreshStatus === 403) {
        setStoredAuth(null, null);
        unauthorizedCallback();
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export const AuthAPI = {
  login: async (
    data: unknown,
  ): Promise<{
    token: string;
    sessionId: string;
    user: { id: string; username: string };
  }> => {
    const response = await api.post<{
      token: string;
      sessionId: string;
      user: { id: string; username: string };
    }>("/auth/login", data);
    return response.data;
  },

  refreshToken: async (
    sessionId: string,
  ): Promise<{
    token: string;
    sessionId: string;
    user: { id: string; username: string };
  }> => {
    const response = await api.post<{
      token: string;
      sessionId: string;
      user: { id: string; username: string };
    }>("/auth/refresh-token", { sessionId });
    return response.data;
  },

  register: async (
    data: RegisterInput,
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

  getSessions: async (): Promise<{
    sessions: Array<{
      id: string;
      userId: string;
      deviceInfo: object;
      ipAddress: string;
      userAgent: string;
      createdAt: string;
      expiresAt: string;
      isActive: boolean;
    }>;
  }> => {
    const response = await api.get<{
      sessions: Array<{
        id: string;
        userId: string;
        deviceInfo: object;
        ipAddress: string;
        userAgent: string;
        createdAt: string;
        expiresAt: string;
        isActive: boolean;
      }>;
    }>("/auth/sessions");
    return response.data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/auth/sessions/${sessionId}`);
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
  list: async (
    filters: {
      jobId?: string;
      reviewerId?: string;
      reviewStatus?: string;
      status?: string;
      q?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<CandidateListResponse> => {
    const params = filters;
    const response = await api.get<CandidateListResponse>("/candidates", {
      params,
    });
    return {
      ...response.data,
      data: response.data.data.map((c) => ({
        ...c,
        appliedAt: new Date(c.appliedAt),
      })),
    };
  },

  get: async (id: string): Promise<Candidate> => {
    const response = await api.get<Candidate>(`/candidates/${id}`);
    return {
      ...response.data,
      appliedAt: new Date(response.data.appliedAt),
    };
  },

  getCounts: async (): Promise<CandidateJobsCount> => {
    const response = await api.get<CandidateJobsCount>("/candidates/counts");
    return response.data;
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

  assignReviewer: async (
    id: string,
    reviewerId: string,
  ): Promise<Candidate> => {
    const response = await api.post<Candidate>(
      `/candidates/${id}/assign-reviewer`,
      {
        reviewerId,
      },
    );
    return {
      ...response.data,
      appliedAt: new Date(response.data.appliedAt),
    };
  },

  review: async (
    id: string,
    reviewStatus: string,
    reviewNote?: string,
  ): Promise<Candidate> => {
    const response = await api.post<Candidate>(`/candidates/${id}/review`, {
      reviewStatus,
      reviewNote,
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
export interface EmployeeAPIResponse {
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
  temporaryPassword?: string;
}

export interface EmployeeListAPIResponse {
  employees: EmployeeAPIResponse[];
  total: number;
  page: number;
  limit: number;
}

export const EmployeesAPI = {
  getMe: async (): Promise<EmployeeAPIResponse> => {
    const response = await api.get<EmployeeAPIResponse>("/employees/me");
    return response.data;
  },

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

// Recruitment Role Response type
export interface RecruitmentRoleResponse {
  isAdmin: boolean;
  isRecruiter: boolean;
  isInterviewer: boolean;
  isHR: boolean;
  canReviewResumes: boolean;
}

// Recruiter type
export interface Recruiter {
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  avatar?: string;
}

// HREmployee type
export interface HREmployee {
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
}

export const RecruitmentAPI = {
  getMyRole: async (): Promise<RecruitmentRoleResponse> => {
    const response =
      await api.get<RecruitmentRoleResponse>("/recruitment/role");
    return response.data;
  },

  getRecruiters: async (): Promise<Recruiter[]> => {
    const response = await api.get<Recruiter[]>(
      "/recruitment/admin/recruiters",
    );
    return response.data;
  },

  assignRecruiter: async (employeeId: string): Promise<void> => {
    await api.post("/recruitment/admin/recruiters", { employeeId });
  },

  revokeRecruiter: async (employeeId: string): Promise<void> => {
    await api.delete("/recruitment/admin/recruiters", { data: { employeeId } });
  },

  transferInterview: async (
    interviewId: string,
    newInterviewerId: string,
  ): Promise<void> => {
    await api.post(`/recruitment/interviews/${interviewId}/transfer`, {
      newInterviewerId,
    });
  },

  // HR Management APIs
  getHRs: async (): Promise<HREmployee[]> => {
    const response = await api.get<HREmployee[]>("/recruitment/admin/hrs");
    return response.data;
  },

  assignHR: async (employeeId: string): Promise<void> => {
    await api.post("/recruitment/admin/hrs", { employeeId });
  },

  revokeHR: async (employeeId: string): Promise<void> => {
    await api.delete("/recruitment/admin/hrs", { data: { employeeId } });
  },
};

const interviewSchema = z.object({
  id: z.string().min(1),
  candidateId: z.string().min(1),
  candidateName: z.string().optional(),
  candidateResumeUrl: z.string().optional(),
  interviewerId: z.string().min(1),
  interviewerName: z.string().optional(),
  jobId: z.string().min(1),
  jobTitle: z.string().optional(),
  scheduledTime: z.string().min(1),
  scheduledEndTime: z.string().min(1),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
  createdAt: z.string().min(1),
  snapshotStatus: z
    .object({
      key: z.string(),
      label: z.string(),
    })
    .optional(),
});

const interviewsSchema = z.array(interviewSchema);

const interviewListResultSchema = z.object({
  interviews: z.array(interviewSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

const normalizeInterviewInput = (data: CreateInterviewInput) => ({
  ...data,
  scheduledTime: data.scheduledTime.toISOString(),
  scheduledEndTime: data.scheduledEndTime.toISOString(),
});

export const InterviewsAPI = {
  create: async (data: CreateInterviewInput): Promise<Interview> => {
    const response = await api.post<unknown>(
      "/recruitment/interviews",
      normalizeInterviewInput(data),
    );
    return interviewSchema.parse(response.data);
  },

  getMyInterviews: async (): Promise<Interview[]> => {
    const response = await api.get<unknown>("/recruitment/interviews/me");
    return interviewsSchema.parse(response.data);
  },

  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    start?: string;
    end?: string;
    status?: string[];
  }): Promise<InterviewListResult> => {
    const queryParams: Record<string, string | number | undefined> = {
      ...params,
      status: params?.status ? params.status.join(",") : undefined,
    };

    const response = await api.get<unknown>("/recruitment/interviews", {
      params: queryParams,
    });
    return interviewListResultSchema.parse(response.data);
  },

  get: async (id: string): Promise<Interview> => {
    const response = await api.get<unknown>(`/recruitment/interviews/${id}`);
    return interviewSchema.parse(response.data);
  },

  update: async (
    id: string,
    data: {
      interviewerId: string;
      scheduledTime: Date;
      scheduledEndTime: Date;
    },
  ): Promise<Interview> => {
    const response = await api.put<unknown>(`/recruitment/interviews/${id}`, {
      ...data,
      scheduledTime: data.scheduledTime.toISOString(),
      scheduledEndTime: data.scheduledEndTime.toISOString(),
    });
    return interviewSchema.parse(response.data);
  },

  updateStatus: async (
    id: string,
    status: "COMPLETED" | "CANCELLED",
  ): Promise<Interview> => {
    const response = await api.patch<unknown>(
      `/recruitment/interviews/${id}/status`,
      { status },
    );
    return interviewSchema.parse(response.data);
  },
};

export const CommentsAPI = {
  list: async (candidateId: string): Promise<CandidateComment[]> => {
    const response = await api.get<CandidateComment[]>(
      `/candidates/${candidateId}/comments`,
    );
    return response.data;
  },

  create: async (
    candidateId: string,
    content: string,
  ): Promise<CandidateComment> => {
    const response = await api.post<CandidateComment>(
      `/candidates/${candidateId}/comments`,
      {
        content,
      },
    );
    return response.data;
  },

  delete: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },
};
