// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecruitmentAPI } from "@/lib/api";
import { useReviewers } from "../useReviewers";

vi.mock("@/lib/api", () => ({
  RecruitmentAPI: {
    getRecruiters: vi.fn(),
    getInterviewers: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useReviewers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and merges recruiters and interviewers", async () => {
    const mockRecruiters = [
      {
        employeeId: "emp1",
        firstName: "John",
        lastName: "Doe",
        department: "Engineering",
      },
      {
        employeeId: "emp2",
        firstName: "Jane",
        lastName: "Smith",
        department: "HR",
      },
    ];

    const mockInterviewers = [
      {
        employeeId: "emp2",
        firstName: "Jane",
        lastName: "Smith",
        department: "HR",
      },
      {
        employeeId: "emp3",
        firstName: "Bob",
        lastName: "Johnson",
        department: "Finance",
      },
    ];

    vi.mocked(RecruitmentAPI.getRecruiters).mockResolvedValue(mockRecruiters);
    vi.mocked(RecruitmentAPI.getInterviewers).mockResolvedValue(
      mockInterviewers,
    );

    const { result } = renderHook(() => useReviewers(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(RecruitmentAPI.getRecruiters).toHaveBeenCalledTimes(1);
    expect(RecruitmentAPI.getInterviewers).toHaveBeenCalledTimes(1);
    expect(result.current.data).toHaveLength(3);
  });

  it("deduplicates reviewers by employeeId", async () => {
    const mockRecruiters = [
      {
        employeeId: "emp1",
        firstName: "John",
        lastName: "Doe",
        department: "Engineering",
      },
    ];

    const mockInterviewers = [
      {
        employeeId: "emp1",
        firstName: "John",
        lastName: "Doe",
        department: "Engineering",
      },
    ];

    vi.mocked(RecruitmentAPI.getRecruiters).mockResolvedValue(mockRecruiters);
    vi.mocked(RecruitmentAPI.getInterviewers).mockResolvedValue(
      mockInterviewers,
    );

    const { result } = renderHook(() => useReviewers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].employeeId).toBe("emp1");
  });

  it("handles errors from recruiters API", async () => {
    vi.mocked(RecruitmentAPI.getRecruiters).mockRejectedValue(
      new Error("Recruiters fetch failed"),
    );
    vi.mocked(RecruitmentAPI.getInterviewers).mockResolvedValue([]);

    const { result } = renderHook(() => useReviewers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it("handles errors from interviewers API", async () => {
    vi.mocked(RecruitmentAPI.getRecruiters).mockResolvedValue([]);
    vi.mocked(RecruitmentAPI.getInterviewers).mockRejectedValue(
      new Error("Interviewers fetch failed"),
    );

    const { result } = renderHook(() => useReviewers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it("returns empty array when both APIs return empty", async () => {
    vi.mocked(RecruitmentAPI.getRecruiters).mockResolvedValue([]);
    vi.mocked(RecruitmentAPI.getInterviewers).mockResolvedValue([]);

    const { result } = renderHook(() => useReviewers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});
