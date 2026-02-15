import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  EMPLOYEE_QUERY_KEY,
  useDeleteEmployee,
  useEmployees,
} from "@/hooks/queries/useEmployees";
import { useUserRole } from "@/hooks/useUserRole";
import { Route } from "@/routes/_protected/employees";
import type { Employee } from "@/types/employee";
import { DeleteEmployeeDialog } from "./components/DeleteEmployeeDialog";
import { EmployeeDetailsDialog } from "./components/EmployeeDetailsDialog";
import { EmployeeFormDialog } from "./components/EmployeeFormDialog";
import { EmployeeList } from "./components/EmployeeList";
import { EmployeesActionToolbar } from "./components/EmployeesActionToolbar";
import { EmployeesHeader } from "./components/EmployeesHeader";

type DialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; employee: Employee }
  | { mode: "view"; employee: Employee };

export function EmployeesPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const filters = Route.useSearch();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useEmployees({
    status: filters.status || undefined,
    department: filters.department || undefined,
    search: filters.search || undefined,
    page: filters.page,
    limit: filters.limit,
  });

  const { mutateAsync: deleteEmployee, isPending: isDeleting } =
    useDeleteEmployee();

  // Check if current user is HR
  const { isHR } = useUserRole();

  const [dialogState, setDialogState] = useState<DialogState>({
    mode: "closed",
  });
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
  };

  const handleSearch = (term: string) => {
    navigate({ search: (prev) => ({ ...prev, search: term, page: 1 }) });
  };

  const handleStatusFilter = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: value === "all" ? undefined : (value as typeof filters.status),
        page: 1,
      }),
    });
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee(employeeToDelete.id);
        toast.success(
          t("employees.deleteSuccess", "Employee deleted successfully"),
        );
        setEmployeeToDelete(null);
      } catch {
        toast.error(t("employees.deleteError", "Failed to delete employee"));
      }
    }
  };

  const employees = data?.employees || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / filters.limit);

  if (isError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-red-500">
          {t("common.error.fetch", "Failed to fetch data")}
        </p>
        <Button onClick={handleRefresh}>{t("common.retry", "Retry")}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmployeesHeader
        total={total}
        isHR={isHR}
        onRefresh={handleRefresh}
        onAdd={() => setDialogState({ mode: "create" })}
      />

      <EmployeesActionToolbar
        defaultSearchValue={filters.search}
        status={filters.status}
        onSearch={handleSearch}
        onStatusChange={handleStatusFilter}
      />

      <div className="rounded-xl bg-white shadow-sm dark:bg-slate-800">
        <EmployeeList
          employees={employees}
          isLoading={isLoading || isDeleting}
          onEdit={(employee) => setDialogState({ mode: "edit", employee })}
          onDelete={handleDeleteClick}
          onView={(employee) => setDialogState({ mode: "view", employee })}
          isHR={isHR}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1}
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, page: prev.page - 1 }) })
            }
          >
            {t("common.previous", "Previous")}
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {t("common.pageOf", "Page {{page}} of {{total}}", {
              page: filters.page,
              total: totalPages,
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= totalPages}
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })
            }
          >
            {t("common.next", "Next")}
          </Button>
        </div>
      )}

      <EmployeeDetailsDialog
        open={dialogState.mode === "view"}
        onOpenChange={(open) => !open && setDialogState({ mode: "closed" })}
        employee={
          dialogState.mode === "view" ? dialogState.employee : undefined
        }
      />

      <EmployeeFormDialog
        key={dialogState.mode === "edit" ? dialogState.employee.id : "new"}
        open={dialogState.mode === "create" || dialogState.mode === "edit"}
        onOpenChange={(open) => !open && setDialogState({ mode: "closed" })}
        employee={
          dialogState.mode === "edit" ? dialogState.employee : undefined
        }
      />

      <DeleteEmployeeDialog
        open={!!employeeToDelete}
        employeeName={
          employeeToDelete
            ? `${employeeToDelete.firstName} ${employeeToDelete.lastName}`
            : undefined
        }
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
