import { createRoute } from "@tanstack/react-router";
import { Route as ProtectedLayoutRoute } from "../_protected";
import { EmployeesPage } from "@/pages/employees/EmployeesPage";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/employees",
  component: EmployeesPage,
});
