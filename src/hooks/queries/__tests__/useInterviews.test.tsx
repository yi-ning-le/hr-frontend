// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InterviewsAPI } from "@/lib/api";
import {
  useCreateInterview,
  useInterview,
  useMyInterviews,
} from "../useInterviews";

// Mock the API
vi.mock("@/lib/api", () => ({
  InterviewsAPI: {
    create: vi.fn(),
    getMyInterviews: vi.fn(),
    get: vi.fn(),
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

  it("useMyInterviews calls InterviewsAPI.getMyInterviews", async () => {
    const mockInterviews = [{ id: "1", candidateName: "John Doe" }];
    (InterviewsAPI.getMyInterviews as any).mockResolvedValue(mockInterviews);

    const { result } = renderHook(() => useMyInterviews(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(InterviewsAPI.getMyInterviews).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockInterviews);
  });

  it("useInterview calls InterviewsAPI.get", async () => {
    const mockInterview = { id: "1", candidateName: "John Doe" };
    (InterviewsAPI.get as any).mockResolvedValue(mockInterview);

    const { result } = renderHook(() => useInterview("1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(InterviewsAPI.get).toHaveBeenCalledWith("1");
    expect(result.current.data).toEqual(mockInterview);
  });

  it("useCreateInterview calls InterviewsAPI.create", async () => {
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
