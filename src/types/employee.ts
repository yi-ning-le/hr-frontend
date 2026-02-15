export type EmployeeStatus = "Active" | "OnLeave" | "Resigned" | "Terminated";

export type EmploymentType = "FullTime" | "PartTime" | "Contract" | "Intern";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  joinDate: Date;
  managerId?: string;
  userId?: string;
  temporaryPassword?: string;
}

export interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status?: EmployeeStatus;
  employmentType?: EmploymentType;
  joinDate: Date;
  managerId?: string;
  userId?: string;
}

export interface EmployeeListResult {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
}

export interface EmployeeFilters {
  status?: EmployeeStatus | "";
  department?: string;
  search?: string;
}
