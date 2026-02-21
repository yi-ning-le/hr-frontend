// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecruitmentAPI } from "@/lib/api";
import {
  buildUserRoleQueryKey,
  USER_ROLE_QUERY_KEY,
  useUserRole,
} from "../useUserRole";

// Mock the API
vi.mock("@/lib/api", () => ({
  RecruitmentAPI: {
    getMyRole: vi.fn(),
  },
}));

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: vi.fn(() => ({
    user: null,
    token: null,
    sessionId: null,
    isAuthenticated: false,
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUserRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct query key", () => {
    expect(USER_ROLE_QUERY_KEY).toEqual(["userRole"]);
    expect(buildUserRoleQueryKey("session-1")).toEqual([
      "userRole",
      "session-1",
    ]);
  });

  it("returns role flags when API succeeds", async () => {
    vi.mocked(RecruitmentAPI.getMyRole).mockResolvedValue({
      isAdmin: true,
      isRecruiter: false,
      isInterviewer: true,
      isHR: false,
    });

    const { result } = renderHook(() => useUserRole(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isRecruiter).toBe(false);
    expect(result.current.isInterviewer).toBe(true);
    expect(result.current.isHR).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("returns default false values when loading", () => {
    vi.mocked(RecruitmentAPI.getMyRole).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    const { result } = renderHook(() => useUserRole(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isRecruiter).toBe(false);
    expect(result.current.isInterviewer).toBe(false);
    expect(result.current.isHR).toBe(false);
  });

  it("handles API error", async () => {
    vi.mocked(RecruitmentAPI.getMyRole).mockRejectedValue(
      new Error("API error"),
    );

    const { result } = renderHook(() => useUserRole(), {
      wrapper: createWrapper(),
    });

    // Hook has retry: 1, so we need a longer timeout for the error to propagate
    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 3000,
    });

    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isRecruiter).toBe(false);
    expect(result.current.isInterviewer).toBe(false);
    expect(result.current.isHR).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("provides refetch function", async () => {
    vi.mocked(RecruitmentAPI.getMyRole).mockResolvedValue({
      isAdmin: false,
      isRecruiter: true,
      isInterviewer: false,
      isHR: true,
    });

    const { result } = renderHook(() => useUserRole(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(typeof result.current.refetch).toBe("function");
    expect(result.current.isRecruiter).toBe(true);
    expect(result.current.isHR).toBe(true);
  });
});
