import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMyEmployeeProfile } from "@/hooks/queries/useMyEmployeeProfile";
import { usePendingResumes } from "@/hooks/queries/usePendingResumes";
import { CandidatesAPI } from "@/lib/api";

// Mock APIs
vi.mock("@/lib/api", () => ({
  CandidatesAPI: {
    list: vi.fn(),
  },
}));

// Mock useMyEmployeeProfile
vi.mock("@/hooks/queries/useMyEmployeeProfile", () => ({
  useMyEmployeeProfile: vi.fn(),
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

describe("usePendingResumes with /employees/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("should return empty list if employee profile is loading or not found", async () => {
    (useMyEmployeeProfile as any).mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { result } = renderHook(() => usePendingResumes(), { wrapper });

    // It might stay in loading state or return empty depending on query state
    // but the `enabled` flag is false, so data should be undefined or empty
    expect(result.current.data).toBeUndefined();
    expect(CandidatesAPI.list).not.toHaveBeenCalled();
  });

  it("should fetch candidates if employee profile is found", async () => {
    (useMyEmployeeProfile as any).mockReturnValue({
      data: { id: "emp123" },
      isLoading: false,
    });

    (CandidatesAPI.list as any).mockResolvedValue({
      data: [{ id: "c1", name: "Candidate 1" }],
      meta: { total: 1, page: 1, limit: 50 },
    });

    const { result } = renderHook(() => usePendingResumes(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: "c1", name: "Candidate 1" }]);
    expect(CandidatesAPI.list).toHaveBeenCalledWith({
      reviewerId: "emp123",
      reviewStatus: "pending",
    });
  });
});
