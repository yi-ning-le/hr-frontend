// Re-export types derived from Zod schemas (single source of truth)
export type {
  Employee,
  EmployeeInput,
  EmployeeListResult,
  EmployeeStatus,
  EmploymentType,
} from "@/lib/schemas/employee";

export interface EmployeeFilters {
  status?: import("@/lib/schemas/employee").EmployeeStatus | "";
  department?: string;
  search?: string;
}
