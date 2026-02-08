import { createRoute } from "@tanstack/react-router";
import { EmployeesPage } from "@/pages/employees/EmployeesPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/employees",
  component: EmployeesPage,
});
