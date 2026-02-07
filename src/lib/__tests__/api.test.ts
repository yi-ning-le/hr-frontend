import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  setAuthToken,
  setUnauthorizedCallback,
  AuthAPI,
  JobsAPI,
  CandidatesAPI,
  RecruitmentAPI,
} from "../api";

// Mock axios
vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

// Get the mocked axios instance
const mockAxios = axios.create() as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("lib/api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("setAuthToken", () => {
    it("should set the auth token without errors", () => {
      expect(() => setAuthToken("test-token")).not.toThrow();
    });

    it("should accept null token", () => {
      expect(() => setAuthToken(null)).not.toThrow();
    });
  });

  describe("setUnauthorizedCallback", () => {
    it("should set the unauthorized callback without errors", () => {
      const callback = vi.fn();
      expect(() => setUnauthorizedCallback(callback)).not.toThrow();
    });

    it("should accept an empty function", () => {
      expect(() => setUnauthorizedCallback(() => {})).not.toThrow();
    });
  });

  describe("AuthAPI", () => {
    describe("login", () => {
      it("should call login endpoint and return token and user", async () => {
        const mockResponse = {
          data: {
            token: "jwt-token",
            user: { id: "1", username: "testuser" },
          },
        };
        mockAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await AuthAPI.login({
          username: "testuser",
          password: "password",
        });

        expect(mockAxios.post).toHaveBeenCalledWith("/auth/login", {
          username: "testuser",
          password: "password",
        });
        expect(result).toEqual(mockResponse.data);
      });
    });

    describe("register", () => {
      it("should call register endpoint and return user data", async () => {
        const mockResponse = {
          data: { id: "1", username: "newuser", email: "test@example.com" },
        };
        mockAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await AuthAPI.register({
          username: "newuser",
          email: "test@example.com",
          password: "password",
        });

        expect(mockAxios.post).toHaveBeenCalledWith("/auth/register", {
          username: "newuser",
          email: "test@example.com",
          password: "password",
        });
        expect(result).toEqual(mockResponse.data);
      });
    });

    describe("logout", () => {
      it("should call logout endpoint", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: {} });

        await AuthAPI.logout();

        expect(mockAxios.post).toHaveBeenCalledWith("/auth/logout");
      });
    });
  });

  describe("JobsAPI", () => {
    const mockJob = {
      id: "1",
      title: "Software Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      status: "OPEN",
      openDate: "2025-01-01T00:00:00.000Z",
      applicants: 10,
    };

    describe("list", () => {
      it("should fetch jobs list and transform dates", async () => {
        mockAxios.get.mockResolvedValueOnce({ data: [mockJob] });

        const result = await JobsAPI.list();

        expect(mockAxios.get).toHaveBeenCalledWith("/jobs");
        expect(result[0].openDate).toBeInstanceOf(Date);
      });
    });

    describe("create", () => {
      it("should create a job and transform dates", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: mockJob });

        const result = await JobsAPI.create({
          title: "Software Engineer",
          department: "Engineering",
        });

        expect(mockAxios.post).toHaveBeenCalledWith("/jobs", {
          title: "Software Engineer",
          department: "Engineering",
        });
        expect(result.openDate).toBeInstanceOf(Date);
      });
    });

    describe("update", () => {
      it("should update a job and transform dates", async () => {
        mockAxios.put.mockResolvedValueOnce({ data: mockJob });

        const result = await JobsAPI.update("1", { title: "Senior Engineer" });

        expect(mockAxios.put).toHaveBeenCalledWith("/jobs/1", {
          title: "Senior Engineer",
        });
        expect(result.openDate).toBeInstanceOf(Date);
      });
    });

    describe("delete", () => {
      it("should delete a job", async () => {
        mockAxios.delete.mockResolvedValueOnce({ data: {} });

        await JobsAPI.delete("1");

        expect(mockAxios.delete).toHaveBeenCalledWith("/jobs/1");
      });
    });

    describe("toggleStatus", () => {
      it("should toggle job status and transform dates", async () => {
        mockAxios.patch.mockResolvedValueOnce({ data: mockJob });

        const result = await JobsAPI.toggleStatus("1");

        expect(mockAxios.patch).toHaveBeenCalledWith("/jobs/1/status");
        expect(result.openDate).toBeInstanceOf(Date);
      });
    });
  });

  describe("CandidatesAPI", () => {
    const mockCandidate = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      position: "Software Engineer",
      status: "NEW",
      appliedAt: "2025-01-01T00:00:00.000Z",
    };

    describe("list", () => {
      it("should fetch candidates list and transform dates", async () => {
        mockAxios.get.mockResolvedValueOnce({ data: [mockCandidate] });

        const result = await CandidatesAPI.list();

        expect(mockAxios.get).toHaveBeenCalledWith("/candidates", {
          params: {},
        });
        expect(result[0].appliedAt).toBeInstanceOf(Date);
      });

      it("should filter by jobId when provided", async () => {
        mockAxios.get.mockResolvedValueOnce({ data: [mockCandidate] });

        await CandidatesAPI.list("job-123");

        expect(mockAxios.get).toHaveBeenCalledWith("/candidates", {
          params: { jobId: "job-123" },
        });
      });

      it("should not filter when jobId is 'all'", async () => {
        mockAxios.get.mockResolvedValueOnce({ data: [mockCandidate] });

        await CandidatesAPI.list("all");

        expect(mockAxios.get).toHaveBeenCalledWith("/candidates", {
          params: {},
        });
      });
    });

    describe("create", () => {
      it("should create a candidate and transform dates", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: mockCandidate });

        const result = await CandidatesAPI.create({
          name: "John Doe",
          email: "john@example.com",
        });

        expect(mockAxios.post).toHaveBeenCalledWith("/candidates", {
          name: "John Doe",
          email: "john@example.com",
        });
        expect(result.appliedAt).toBeInstanceOf(Date);
      });
    });

    describe("update", () => {
      it("should update a candidate and transform dates", async () => {
        mockAxios.put.mockResolvedValueOnce({ data: mockCandidate });

        const result = await CandidatesAPI.update("1", { name: "Jane Doe" });

        expect(mockAxios.put).toHaveBeenCalledWith("/candidates/1", {
          name: "Jane Doe",
        });
        expect(result.appliedAt).toBeInstanceOf(Date);
      });
    });

    describe("delete", () => {
      it("should delete a candidate", async () => {
        mockAxios.delete.mockResolvedValueOnce({ data: {} });

        await CandidatesAPI.delete("1");

        expect(mockAxios.delete).toHaveBeenCalledWith("/candidates/1");
      });
    });

    describe("updateStatus", () => {
      it("should update candidate status and transform dates", async () => {
        mockAxios.patch.mockResolvedValueOnce({ data: mockCandidate });

        const result = await CandidatesAPI.updateStatus("1", "interview");

        expect(mockAxios.patch).toHaveBeenCalledWith("/candidates/1/status", {
          status: "interview",
        });
        expect(result.appliedAt).toBeInstanceOf(Date);
      });
    });

    describe("updateNote", () => {
      it("should update candidate note and transform dates", async () => {
        mockAxios.patch.mockResolvedValueOnce({ data: mockCandidate });

        const result = await CandidatesAPI.updateNote("1", "Good candidate");

        expect(mockAxios.patch).toHaveBeenCalledWith("/candidates/1/note", {
          note: "Good candidate",
        });
        expect(result.appliedAt).toBeInstanceOf(Date);
      });
    });

    describe("uploadResume", () => {
      it("should upload resume with multipart form data", async () => {
        const mockFile = new File(["resume content"], "resume.pdf", {
          type: "application/pdf",
        });
        mockAxios.post.mockResolvedValueOnce({
          data: {
            resumeUrl: "https://example.com/resume.pdf",
            candidate: mockCandidate,
          },
        });

        const result = await CandidatesAPI.uploadResume("1", mockFile);

        expect(mockAxios.post).toHaveBeenCalledWith(
          "/candidates/1/resume",
          expect.any(FormData),
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        expect(result.resumeUrl).toBe("https://example.com/resume.pdf");
        expect(result.candidate.appliedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe("RecruitmentAPI", () => {
    describe("getMyRole", () => {
      it("should fetch my recruitment role", async () => {
        const mockRole = {
          isAdmin: true,
          isRecruiter: true,
          isInterviewer: false,
        };
        mockAxios.get.mockResolvedValueOnce({ data: mockRole });

        const result = await RecruitmentAPI.getMyRole();

        expect(mockAxios.get).toHaveBeenCalledWith("/recruitment/role");
        expect(result).toEqual(mockRole);
      });
    });

    describe("getRecruiters", () => {
      it("should fetch recruiters list", async () => {
        const mockRecruiters = [
          {
            employeeId: "123",
            firstName: "John",
            lastName: "Doe",
            department: "HR",
          },
        ];
        mockAxios.get.mockResolvedValueOnce({ data: mockRecruiters });

        const result = await RecruitmentAPI.getRecruiters();

        expect(mockAxios.get).toHaveBeenCalledWith(
          "/recruitment/admin/recruiters",
        );
        expect(result).toEqual(mockRecruiters);
      });
    });

    describe("assignRecruiter", () => {
      it("should assign recruiter role", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: {} });

        await RecruitmentAPI.assignRecruiter("emp-123");

        expect(mockAxios.post).toHaveBeenCalledWith(
          "/recruitment/admin/recruiters",
          {
            employeeId: "emp-123",
          },
        );
      });
    });

    describe("revokeRecruiter", () => {
      it("should revoke recruiter role by sending employeeId in body", async () => {
        mockAxios.delete.mockResolvedValueOnce({ data: {} });

        await RecruitmentAPI.revokeRecruiter("emp-123");

        expect(mockAxios.delete).toHaveBeenCalledWith(
          "/recruitment/admin/recruiters",
          {
            data: { employeeId: "emp-123" },
          },
        );
      });
    });
  });
});
