// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCandidateStatusQueries } from "../useCandidateStatuses";
import { CandidateStatusesAPI } from "@/lib/api";

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

  it("fetches statuses and builds statusMap", async () => {
    const mockStatuses = [{ id: "1", slug: "new", name: "New" }];
    vi.mocked(CandidateStatusesAPI.list).mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockStatuses as unknown as any,
    );

    const { result } = renderHook(() => useCandidateStatusQueries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.statuses).toEqual(mockStatuses);
    expect(result.current.data?.statusMap["new"]).toEqual(mockStatuses[0]);
    expect(result.current.data?.statusMap["1"]).toEqual(mockStatuses[0]);
  });
});
