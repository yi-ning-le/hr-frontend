import { createRoute } from "@tanstack/react-router";
import { Route as ProtectedLayoutRoute } from "../_protected";
import { EmployeeProfilePage } from "@/pages/employees/EmployeeProfilePage";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/employees/$employeeId",
  component: EmployeeProfilePage,
});
