// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type EmployeeAPIResponse, EmployeesAPI } from "@/lib/api";
import type { EmployeeInput } from "@/types/employee";
import {
  useCreateEmployee,
  useDeleteEmployee,
  useUpdateEmployee,
} from "../useEmployees";

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

describe("Employee Mutations", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("creates an employee and invalidates queries", async () => {
    const mockEmployee = { id: "1", firstName: "New" };
    vi.mocked(EmployeesAPI.create).mockResolvedValue(
      mockEmployee as unknown as EmployeeAPIResponse,
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateEmployee(), { wrapper });

    const input: EmployeeInput = {
      firstName: "New",
      lastName: "Employee",
      email: "new@example.com",
      phone: "1234567890",
      department: "Engineering",
      position: "Developer",
      joinDate: new Date(),
    };
    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(EmployeesAPI.create).toHaveBeenCalled();
  });

  it("updates an employee", async () => {
    const mockEmployee = { id: "1", firstName: "Updated" };
    vi.mocked(EmployeesAPI.update).mockResolvedValue(
      mockEmployee as unknown as EmployeeAPIResponse,
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useUpdateEmployee(), { wrapper });

    const updateData: EmployeeInput = {
      firstName: "Updated",
      lastName: "Employee",
      email: "updated@example.com",
      phone: "1234567890",
      department: "Engineering",
      position: "Developer",
      joinDate: new Date(),
    };
    result.current.mutate({ id: "1", data: updateData });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(EmployeesAPI.update).toHaveBeenCalledWith("1", expect.anything());
  });

  it("deletes an employee", async () => {
    vi.mocked(EmployeesAPI.delete).mockResolvedValue(undefined);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useDeleteEmployee(), { wrapper });

    result.current.mutate("1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(EmployeesAPI.delete).toHaveBeenCalledWith("1");
  });
});
