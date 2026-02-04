import { create } from "zustand";
import type {
  Employee,
  EmployeeStatus,
  EmployeeFilters,
} from "@/types/employee";
import { EmployeesAPI } from "@/lib/api";

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  filters: EmployeeFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEmployees: () => Promise<void>;
  getEmployee: (id: string) => Promise<Employee | null>;
  addEmployee: (data: Omit<Employee, "id">) => Promise<void>;
  updateEmployee: (id: string, data: Omit<Employee, "id">) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  setFilters: (filters: Partial<EmployeeFilters>) => void;
  setPage: (page: number) => void;
  selectEmployee: (employee: Employee | null) => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  filters: {
    status: "",
    department: "",
    search: "",
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    const { filters, pagination } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await EmployeesAPI.list({
        status: filters.status || undefined,
        department: filters.department || undefined,
        search: filters.search || undefined,
        page: pagination.page,
        limit: pagination.limit,
      });
      const employees: Employee[] = result.employees.map((e) => ({
        ...e,
        status: e.status as EmployeeStatus,
        employmentType: e.employmentType as Employee["employmentType"],
        joinDate: new Date(e.joinDate),
      }));
      set({
        employees,
        pagination: {
          ...pagination,
          total: result.total,
        },
        isLoading: false,
      });
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to fetch employees", isLoading: false });
    }
  },

  getEmployee: async (id: string) => {
    try {
      const data = await EmployeesAPI.get(id);
      const employee: Employee = {
        ...data,
        status: data.status as EmployeeStatus,
        employmentType: data.employmentType as Employee["employmentType"],
        joinDate: new Date(data.joinDate),
      };
      set({ selectedEmployee: employee });
      return employee;
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to fetch employee" });
      return null;
    }
  },

  addEmployee: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await EmployeesAPI.create({
        ...data,
        status: data.status || "Active",
        employmentType: data.employmentType || "FullTime",
        joinDate: data.joinDate.toISOString(),
      });
      await get().fetchEmployees();
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to add employee", isLoading: false });
    }
  },

  updateEmployee: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await EmployeesAPI.update(id, {
        ...data,
        joinDate: data.joinDate.toISOString(),
      });
      await get().fetchEmployees();
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to update employee", isLoading: false });
    }
  },

  deleteEmployee: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await EmployeesAPI.delete(id);
      set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
        isLoading: false,
      }));
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to delete employee", isLoading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 },
    }));
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
  },

  selectEmployee: (employee) => set({ selectedEmployee: employee }),
}));
