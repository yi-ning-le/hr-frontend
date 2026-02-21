// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecruitmentAPI } from "@/lib/api";
import { useInterviewers } from "../useInterviewers";

vi.mock("@/lib/api", () => ({
  RecruitmentAPI: {
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

describe("useInterviewers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches interviewers successfully", async () => {
    const mockInterviewers = [
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

    vi.mocked(RecruitmentAPI.getInterviewers).mockResolvedValue(
      mockInterviewers,
    );

    const { result } = renderHook(() => useInterviewers(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].firstName).toBe("John");
    expect(RecruitmentAPI.getInterviewers).toHaveBeenCalledTimes(1);
  });

  it("handles errors", async () => {
    vi.mocked(RecruitmentAPI.getInterviewers).mockRejectedValue(
      new Error("Fetch failed"),
    );

    const { result } = renderHook(() => useInterviewers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it("returns empty array when no interviewers", async () => {
    vi.mocked(RecruitmentAPI.getInterviewers).mockResolvedValue([]);

    const { result } = renderHook(() => useInterviewers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});
