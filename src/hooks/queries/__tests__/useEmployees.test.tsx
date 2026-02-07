// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEmployees } from "../useEmployees";
import { EmployeesAPI, type EmployeeAPIResponse } from "@/lib/api";

// Mock EmployeesAPI
vi.mock("@/lib/api", () => ({
  EmployeesAPI: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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

describe("useEmployees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches employees and transforms dates", async () => {
    const mockEmployees = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        joinDate: "2023-01-01T00:00:00Z",
        status: "Active",
        employmentType: "FullTime",
      },
    ];

    vi.mocked(EmployeesAPI.list).mockResolvedValue({
      employees: mockEmployees as unknown as EmployeeAPIResponse[],
      total: 1,
      page: 1,
      limit: 10,
    });

    const { result } = renderHook(() => useEmployees({ page: 1, limit: 10 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.employees[0].firstName).toBe("John");
    expect(result.current.data?.employees[0].joinDate).toBeInstanceOf(Date);
    expect(EmployeesAPI.list).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it("handles errors", async () => {
    vi.mocked(EmployeesAPI.list).mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useEmployees({ page: 1, limit: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
