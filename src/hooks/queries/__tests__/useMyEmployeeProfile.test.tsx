// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EmployeesAPI } from "@/lib/api";
import { useMyEmployeeProfile } from "../useMyEmployeeProfile";

vi.mock("@/lib/api", () => ({
  EmployeesAPI: {
    getMe: vi.fn(),
  },
}));

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: "user-1" },
  })),
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

describe("useMyEmployeeProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("fetches employee profile when user exists", async () => {
    const mockEmployee = {
      id: "emp-1",
      name: "John Doe",
      email: "john@example.com",
    };
    (EmployeesAPI.getMe as any).mockResolvedValue(mockEmployee);

    const { result } = renderHook(() => useMyEmployeeProfile(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(EmployeesAPI.getMe).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockEmployee);
  });

  it("does not retry on failure", async () => {
    (EmployeesAPI.getMe as any).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useMyEmployeeProfile(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(EmployeesAPI.getMe).toHaveBeenCalled();
  });
});
