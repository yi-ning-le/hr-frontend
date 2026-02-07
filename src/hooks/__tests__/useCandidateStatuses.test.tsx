// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCandidateStatuses } from "../useCandidateStatuses";
import { CandidateStatusesAPI } from "@/lib/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock the API
vi.mock("@/lib/api", () => ({
  CandidateStatusesAPI: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    reorder: vi.fn(),
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

describe("useCandidateStatuses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch statuses and provide them in the returned object", async () => {
    const mockStatuses = [{ id: "1", slug: "new", name: "New" }];
    vi.mocked(CandidateStatusesAPI.list).mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockStatuses as unknown as any,
    );

    const { result } = renderHook(() => useCandidateStatuses(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.statuses).toEqual(mockStatuses);
    expect(result.current.statusMap["new"]).toEqual(mockStatuses[0]);
  });
});
