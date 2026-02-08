// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CandidatesAPI } from "@/lib/api";
import { useCandidates } from "../useCandidates";

vi.mock("@/lib/api", () => ({
  CandidatesAPI: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    updateStatus: vi.fn(),
    updateNote: vi.fn(),
    uploadResume: vi.fn(),
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

describe("useCandidates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches candidates and transforms dates", async () => {
    const mockCandidates = [
      { id: "1", name: "Alice", appliedAt: "2023-01-01T00:00:00Z" },
    ];
    vi.mocked(CandidatesAPI.list).mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockCandidates as unknown as any,
    );

    const { result } = renderHook(() => useCandidates("all"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].appliedAt).toBeInstanceOf(Date);
    expect(CandidatesAPI.list).toHaveBeenCalledWith("all");
  });
});
