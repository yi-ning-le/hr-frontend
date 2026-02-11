import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { EmployeesPage } from "@/pages/employees/EmployeesPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

export const employeeSearchSchema = z.object({
  page: z.number().min(1).max(1000).catch(1),
  limit: z.number().min(1).max(100).catch(20),
  search: z.string().optional(),
  status: z.enum(["Active", "OnLeave", "Resigned", "Terminated"]).optional(),
  department: z.string().optional(),
});

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/employees",
  validateSearch: (search) => employeeSearchSchema.parse(search),
  component: EmployeesPage,
});
