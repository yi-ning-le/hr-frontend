import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePendingResumes } from "@/hooks/queries/usePendingResumes";
import { CandidatesAPI } from "@/lib/api";

// Mock APIs
vi.mock("@/lib/api", () => ({
  CandidatesAPI: {
    getPending: vi.fn(),
  },
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

describe("usePendingResumes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("should fetch pending candidates", async () => {
    (CandidatesAPI.getPending as any).mockResolvedValue([
      { id: "c1", name: "Candidate 1" },
    ]);

    const { result } = renderHook(() => usePendingResumes(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: "c1", name: "Candidate 1" }]);
    expect(CandidatesAPI.getPending).toHaveBeenCalledTimes(1);
  });

  it("should expose error state when request fails", async () => {
    (CandidatesAPI.getPending as any).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => usePendingResumes(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(CandidatesAPI.getPending).toHaveBeenCalledTimes(1);
  });
});
