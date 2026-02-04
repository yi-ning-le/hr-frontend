import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEmployeeStore } from "../useEmployeeStore";
import { EmployeesAPI } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  EmployeesAPI: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useEmployeeStore", () => {
  const mockEmployee = {
    id: "1",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "1234567890",
    department: "Engineering",
    position: "Developer",
    status: "Active",
    employmentType: "FullTime",
    joinDate: "2024-01-15T00:00:00Z",
  };

  beforeEach(() => {
    useEmployeeStore.setState({
      employees: [],
      selectedEmployee: null,
      filters: { status: "", department: "", search: "" },
      pagination: { page: 1, limit: 20, total: 0 },
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe("fetchEmployees", () => {
    it("should fetch and set employees", async () => {
      vi.mocked(EmployeesAPI.list).mockResolvedValue({
        employees: [mockEmployee],
        total: 1,
        page: 1,
        limit: 20,
      });

      await useEmployeeStore.getState().fetchEmployees();

      expect(useEmployeeStore.getState().employees).toHaveLength(1);
      expect(useEmployeeStore.getState().employees[0].firstName).toBe("Test");
      expect(useEmployeeStore.getState().isLoading).toBe(false);
    });

    it("should handle fetch errors", async () => {
      vi.mocked(EmployeesAPI.list).mockRejectedValue(new Error("Fetch failed"));

      await useEmployeeStore.getState().fetchEmployees();

      expect(useEmployeeStore.getState().error).toBe(
        "Failed to fetch employees",
      );
      expect(useEmployeeStore.getState().isLoading).toBe(false);
    });
  });

  describe("getEmployee", () => {
    it("should get a single employee", async () => {
      vi.mocked(EmployeesAPI.get).mockResolvedValue(mockEmployee);

      const employee = await useEmployeeStore.getState().getEmployee("1");

      expect(employee).not.toBeNull();
      expect(employee?.firstName).toBe("Test");
      expect(useEmployeeStore.getState().selectedEmployee?.firstName).toBe(
        "Test",
      );
    });

    it("should handle get errors", async () => {
      vi.mocked(EmployeesAPI.get).mockRejectedValue(new Error("Not found"));

      const employee = await useEmployeeStore.getState().getEmployee("999");

      expect(employee).toBeNull();
      expect(useEmployeeStore.getState().error).toBe(
        "Failed to fetch employee",
      );
    });
  });

  describe("deleteEmployee", () => {
    it("should delete an employee", async () => {
      useEmployeeStore.setState({
        employees: [
          {
            ...mockEmployee,
            status: "Active" as const,
            employmentType: "FullTime" as const,
            joinDate: new Date("2024-01-15"),
          },
        ],
      });

      vi.mocked(EmployeesAPI.delete).mockResolvedValue(undefined);

      await useEmployeeStore.getState().deleteEmployee("1");

      expect(useEmployeeStore.getState().employees).toHaveLength(0);
    });
  });

  describe("setFilters", () => {
    it("should set filters and reset page", () => {
      useEmployeeStore.setState({
        pagination: { page: 3, limit: 20, total: 100 },
      });

      useEmployeeStore.getState().setFilters({ status: "Active" });

      expect(useEmployeeStore.getState().filters.status).toBe("Active");
      expect(useEmployeeStore.getState().pagination.page).toBe(1);
    });
  });

  describe("setPage", () => {
    it("should update page number", () => {
      useEmployeeStore.getState().setPage(5);

      expect(useEmployeeStore.getState().pagination.page).toBe(5);
    });
  });
});
