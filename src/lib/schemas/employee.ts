import { z } from "zod";

export const EmployeeStatusEnum = z.enum([
  "Active",
  "OnLeave",
  "Resigned",
  "Terminated",
]);

export const EmploymentTypeEnum = z.enum([
  "FullTime",
  "PartTime",
  "Contract",
  "Intern",
]);

export const employeeSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  phone: z.string(),
  department: z.string().min(1),
  position: z.string().min(1),
  status: EmployeeStatusEnum,
  employmentType: EmploymentTypeEnum,
  joinDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  managerId: z.string().optional(),
  userId: z.string().optional(),
  temporaryPassword: z.string().optional(),
});

export const employeeInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  department: z.string().min(1),
  position: z.string().min(1),
  status: EmployeeStatusEnum.optional(),
  employmentType: EmploymentTypeEnum.optional(),
  joinDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  managerId: z.string().optional(),
  userId: z.string().optional(),
});

export const employeeListResultSchema = z.object({
  employees: z.array(employeeSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

// Derive TypeScript types from Zod schemas (single source of truth)
export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeInput = z.infer<typeof employeeInputSchema>;
export type EmployeeListResult = z.infer<typeof employeeListResultSchema>;
export type EmployeeStatus = z.infer<typeof EmployeeStatusEnum>;
export type EmploymentType = z.infer<typeof EmploymentTypeEnum>;

// Input type for API methods (pre-transform, accepts string | Date for joinDate)
export type EmployeeAPIInput = z.input<typeof employeeInputSchema>;
