import type { EmployeeStatus, EmploymentType } from "@/types/employee";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const STATUS_VARIANT: Record<EmployeeStatus, BadgeVariant> = {
  Active: "default",
  OnLeave: "secondary",
  Resigned: "destructive",
  Terminated: "destructive",
};

export const getStatusVariant = (status: EmployeeStatus): BadgeVariant =>
  STATUS_VARIANT[status] ?? "outline";

const STATUS_KEY: Record<EmployeeStatus, string> = {
  Active: "employees.status.active",
  OnLeave: "employees.status.onLeave",
  Resigned: "employees.status.resigned",
  Terminated: "employees.status.terminated",
};

export const getEmployeeStatusKey = (status: EmployeeStatus): string =>
  STATUS_KEY[status] ?? `employees.status.${status}`;

const EMPLOYMENT_TYPE_KEY: Record<EmploymentType, string> = {
  FullTime: "employees.type.fullTime",
  PartTime: "employees.type.partTime",
  Contract: "employees.type.contract",
  Intern: "employees.type.intern",
};

export const getEmploymentTypeKey = (type: EmploymentType): string =>
  EMPLOYMENT_TYPE_KEY[type] ?? `employees.type.${type}`;
