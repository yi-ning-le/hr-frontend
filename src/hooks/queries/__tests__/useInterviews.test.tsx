// @vitest-environment jsdom
import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCreateInterview,
  useMyInterviews,
  useInterview,
  useUpdateInterviewNotes,
} from "../useInterviews";

// Mock useAuthStore
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: {
    getState: () => ({ token: "test-token" }),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockInterview = {
  id: "interview-1",
  candidateId: "candidate-1",
  interviewerId: "emp-1",
  scheduledAt: "2024-01-15T10:00:00Z",
  notes: "Initial notes",
  status: "scheduled",
};

describe("useInterviews hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("useMyInterviews", () => {
    it("fetches current user interviews", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockInterview]),
      } as Response);

      const { result } = renderHook(() => useMyInterviews(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([mockInterview]);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/recruitment/interviews/me"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        }),
      );
    });

    it("handles fetch error", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      const { result } = renderHook(() => useMyInterviews(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe("useInterview", () => {
    it("fetches single interview by id", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInterview),
      } as Response);

      const { result } = renderHook(() => useInterview("interview-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockInterview);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/recruitment/interviews/interview-1"),
        expect.any(Object),
      );
    });

    it("does not fetch when id is empty", () => {
      const { result } = renderHook(() => useInterview(""), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe("idle");
    });
  });

  describe("useCreateInterview", () => {
    it("creates interview and invalidates queries", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInterview),
      } as Response);

      const { result } = renderHook(() => useCreateInterview(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync({
          candidateId: "candidate-1",
          interviewerId: "emp-1",
          jobId: "job-1",
          scheduledTime: new Date("2024-01-15T10:00:00Z"),
        });
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/recruitment/interviews"),
        expect.objectContaining({
          method: "POST",
          body: expect.any(String),
        }),
      );
    });
  });

  describe("useUpdateInterviewNotes", () => {
    it("updates interview notes", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ ...mockInterview, notes: "Updated notes" }),
      } as Response);

      const { result } = renderHook(() => useUpdateInterviewNotes(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync({
          id: "interview-1",
          notes: "Updated notes",
        });
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/recruitment/interviews/interview-1/notes"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ notes: "Updated notes" }),
        }),
      );
    });
  });
});
