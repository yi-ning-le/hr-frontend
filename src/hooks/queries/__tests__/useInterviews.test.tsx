// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InterviewsAPI } from "@/lib/api";
import {
  useCreateInterview,
  useDeleteInterview,
  useInterview,
  useInterviews,
  useMyInterviews,
  useUpdateInterview,
  useUpdateInterviewStatus,
} from "../useInterviews";

// Mock the API
vi.mock("@/lib/api", () => ({
  InterviewsAPI: {
    create: vi.fn(),
    getMyInterviews: vi.fn(),
    get: vi.fn(),
    updateStatus: vi.fn(),
    getAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: (
    selector: (state: { user: { id: string }; token: string }) => unknown,
  ) =>
    selector({
      user: { id: "user-1" },
      token: "token-1",
    }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useInterviews Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe("useMyInterviews", () => {
    it("calls InterviewsAPI.getMyInterviews", async () => {
      const mockInterviews = [{ id: "1", candidateName: "John Doe" }];
      (InterviewsAPI.getMyInterviews as any).mockResolvedValue(mockInterviews);

      const { result } = renderHook(() => useMyInterviews(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(InterviewsAPI.getMyInterviews).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockInterviews);
    });
  });

  describe("useInterview", () => {
    it("calls InterviewsAPI.get", async () => {
      const mockInterview = { id: "1", candidateName: "John Doe" };
      (InterviewsAPI.get as any).mockResolvedValue(mockInterview);

      const { result } = renderHook(() => useInterview("1"), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(InterviewsAPI.get).toHaveBeenCalledWith("1");
      expect(result.current.data).toEqual(mockInterview);
    });

    it("does not call API if id is falsy", () => {
      renderHook(() => useInterview(""), { wrapper });
      expect(InterviewsAPI.get).not.toHaveBeenCalled();
    });
  });

  describe("useCreateInterview", () => {
    it("calls InterviewsAPI.create and invalidates queries", async () => {
      const newInterview = {
        candidateId: "c1",
        jobId: "j1",
        scheduledTime: "2023-01-01",
      };
      (InterviewsAPI.create as any).mockResolvedValue({
        id: "1",
        ...newInterview,
      });

      const { result } = renderHook(() => useCreateInterview(), { wrapper });

      result.current.mutate(newInterview as any);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(InterviewsAPI.create).toHaveBeenCalledWith(newInterview);
    });
  });

  describe("useUpdateInterviewStatus", () => {
    it("calls InterviewsAPI.updateStatus and invalidates queries", async () => {
      const updateData = {
        id: "1",
        status: "COMPLETED" as const,
        result: "PASS" as const,
      };
      (InterviewsAPI.updateStatus as any).mockResolvedValue({});

      const { result } = renderHook(() => useUpdateInterviewStatus(), {
        wrapper,
      });

      result.current.mutate(updateData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(InterviewsAPI.updateStatus).toHaveBeenCalledWith(updateData);
    });
  });

  describe("useInterviews (list)", () => {
    it("calls InterviewsAPI.getAll with params", async () => {
      const mockData = { interviews: [], total: 0 };
      const params = { page: 1, pageSize: 10 };
      (InterviewsAPI.getAll as any).mockResolvedValue(mockData);

      const { result } = renderHook(() => useInterviews(params), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
      expect(InterviewsAPI.getAll).toHaveBeenCalledWith(params);
    });
  });

  describe("useUpdateInterview", () => {
    it("calls InterviewsAPI.update and invalidates queries", async () => {
      const updateData = {
        id: "1",
        data: {
          interviewerId: "i2",
          scheduledTime: new Date("2023-01-02"),
          scheduledEndTime: new Date("2023-01-02"),
        },
      };
      (InterviewsAPI.update as any).mockResolvedValue({});

      const { result } = renderHook(() => useUpdateInterview(), { wrapper });

      result.current.mutate(updateData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(InterviewsAPI.update).toHaveBeenCalledWith(
        updateData.id,
        updateData.data,
      );
    });
  });

  describe("useDeleteInterview", () => {
    it("calls InterviewsAPI.delete and invalidates interview queries", async () => {
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      (InterviewsAPI.delete as any).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteInterview(), { wrapper });

      result.current.mutate("1");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(InterviewsAPI.delete).toHaveBeenCalledWith("1");
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["interviews", "user-1"],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["interviews", "user-1", "1"],
      });
      invalidateSpy.mockRestore();
    });
  });
});
