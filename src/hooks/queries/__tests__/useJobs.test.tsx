// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useJobs } from "../useJobs";
import { JobsAPI } from "@/lib/api";
import type { JobPosition } from "@/types/job";

vi.mock("@/lib/api", () => ({
  JobsAPI: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    toggleStatus: vi.fn(),
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

describe("useJobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches jobs and transforms dates", async () => {
    const mockJobs = [
      { id: "1", title: "Dev", openDate: "2023-01-01T00:00:00Z" },
    ];
    vi.mocked(JobsAPI.list).mockResolvedValue(
      mockJobs as unknown as JobPosition[],
    );

    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].openDate).toBeInstanceOf(Date);
  });
});
