import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Employee } from "@/types/employee";
import { Link } from "@tanstack/react-router";

interface EmployeeListProps {
  employees: Employee[];
  isLoading: boolean;
}

export function EmployeeList({ employees, isLoading }: EmployeeListProps) {
  const { t } = useTranslation();

  const getStatusVariant = (status: Employee["status"]) => {
    switch (status) {
      case "Active":
        return "default";
      case "OnLeave":
        return "secondary";
      case "Resigned":
      case "Terminated":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: Employee["status"]) => {
    switch (status) {
      case "Active":
        return t("employees.status.active", "Active");
      case "OnLeave":
        return t("employees.status.onLeave", "On Leave");
      case "Resigned":
        return t("employees.status.resigned", "Resigned");
      case "Terminated":
        return t("employees.status.terminated", "Terminated");
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">👥</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t("employees.noEmployees", "No employees found")}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("employees.noEmployeesDescription", "Add your first team member to get started.")}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("employees.columns.name", "Name")}</TableHead>
          <TableHead>{t("employees.columns.department", "Department")}</TableHead>
          <TableHead>{t("employees.columns.position", "Position")}</TableHead>
          <TableHead>{t("employees.columns.status", "Status")}</TableHead>
          <TableHead>{t("employees.columns.joinDate", "Join Date")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <TableCell>
              <Link
                to="/employees/$employeeId"
                params={{ employeeId: employee.id }}
                className="flex items-center gap-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {employee.firstName[0]}
                    {employee.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {employee.firstName} {employee.lastName}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {employee.email}
                  </div>
                </div>
              </Link>
            </TableCell>
            <TableCell>{employee.department}</TableCell>
            <TableCell>{employee.position}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(employee.status)}>
                {getStatusLabel(employee.status)}
              </Badge>
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(new Date(employee.joinDate))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
