import { create } from "zustand";
import type { Employee, EmployeeFilters } from "@/types/employee";

interface EmployeeState {
  selectedEmployee: Employee | null;
  filters: EmployeeFilters;
  pagination: {
    page: number;
    limit: number;
  };

  // Actions
  setFilters: (filters: Partial<EmployeeFilters>) => void;
  setPage: (page: number) => void;
  selectEmployee: (employee: Employee | null) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  selectedEmployee: null,
  filters: {
    status: "",
    department: "",
    search: "",
  },
  pagination: {
    page: 1,
    limit: 20,
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
