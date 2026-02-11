import { createRoute } from "@tanstack/react-router";
import { EmployeeProfilePage } from "@/pages/employees/EmployeeProfilePage";
import { employeeSearchSchema } from "./employees";
import { Route as ProtectedLayoutRoute } from "../_protected";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/employees/$employeeId",
  validateSearch: (search) => employeeSearchSchema.parse(search),
  component: EmployeeProfilePage,
});
