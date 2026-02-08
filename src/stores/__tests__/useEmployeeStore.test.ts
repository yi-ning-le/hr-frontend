import { beforeEach, describe, expect, it } from "vitest";
import { useEmployeeStore } from "../useEmployeeStore";

describe("useEmployeeStore", () => {
  beforeEach(() => {
    useEmployeeStore.setState({
      filters: { status: "", department: "", search: "" },
      pagination: { page: 1, limit: 20 },
      selectedEmployee: null,
    });
  });

  it("should set filters and reset page", () => {
    useEmployeeStore.setState({
      pagination: { page: 3, limit: 20 },
    });

    useEmployeeStore.getState().setFilters({ status: "Active" });

    expect(useEmployeeStore.getState().filters.status).toBe("Active");
    expect(useEmployeeStore.getState().pagination.page).toBe(1);
  });

  it("should update page number", () => {
    useEmployeeStore.getState().setPage(5);
    expect(useEmployeeStore.getState().pagination.page).toBe(5);
  });

  it("should select employee", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockEmployee = { id: "1", firstName: "John" } as unknown as any;
    useEmployeeStore.getState().selectEmployee(mockEmployee);
    expect(useEmployeeStore.getState().selectedEmployee).toEqual(mockEmployee);
  });
});
