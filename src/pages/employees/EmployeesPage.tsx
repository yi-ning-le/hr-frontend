import { useTranslation } from "react-i18next";
import { Users, UserPlus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEmployeeStore } from "@/stores/useEmployeeStore";
import { useState } from "react";
import { EmployeeList } from "./components/EmployeeList";
import { EmployeeFormDialog } from "./components/EmployeeFormDialog";
import type { Employee } from "@/types/employee";
import { useEmployees, useDeleteEmployee } from "@/hooks/queries/useEmployees";
import { toast } from "sonner";

export function EmployeesPage() {
  const { t } = useTranslation();
  const { filters, pagination, setFilters, setPage } = useEmployeeStore();

  const { data, isLoading, isError } = useEmployees({
    status: filters.status || undefined,
    department: filters.department || undefined,
    search: filters.search || undefined,
    page: pagination.page,
    limit: pagination.limit,
  });

  const { mutateAsync: deleteEmployee, isPending: isDeleting } =
    useDeleteEmployee();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchInput });
  };

  const handleStatusFilter = (value: string) => {
    setFilters({
      status: value === "all" ? "" : (value as typeof filters.status),
    });
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsReadOnly(true);
    setIsAddDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsReadOnly(false);
    setIsAddDialogOpen(true);
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

  const handleDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setSelectedEmployee(null);
      setIsReadOnly(false);
    }
  };

  const employees = data?.employees || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pagination.limit);

  if (isError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-red-500">
          {t("common.error.fetch", "Failed to fetch data")}
        </p>
        <Button onClick={() => window.location.reload()}>
          {t("common.retry", "Retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("employees.title", "Employees")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("employees.subtitle", "Manage your team members")}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t("employees.addEmployee", "Add Employee")}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:flex-row sm:items-center">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t(
              "employees.searchPlaceholder",
              "Search by name or email...",
            )}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </form>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue
                placeholder={t("employees.filterStatus", "Status")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("employees.allStatuses", "All Statuses")}
              </SelectItem>
              <SelectItem value="Active">
                {t("employees.status.active", "Active")}
              </SelectItem>
              <SelectItem value="OnLeave">
                {t("employees.status.onLeave", "On Leave")}
              </SelectItem>
              <SelectItem value="Resigned">
                {t("employees.status.resigned", "Resigned")}
              </SelectItem>
              <SelectItem value="Terminated">
                {t("employees.status.terminated", "Terminated")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employee List */}
      <div className="rounded-xl bg-white shadow-sm dark:bg-slate-800">
        <EmployeeList
          employees={employees}
          isLoading={isLoading || isDeleting}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteClick}
          onView={handleViewEmployee}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setPage(pagination.page - 1)}
          >
            {t("common.previous", "Previous")}
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {t("common.pageOf", "Page {{page}} of {{total}}", {
              page: pagination.page,
              total: totalPages,
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= totalPages}
            onClick={() => setPage(pagination.page + 1)}
          >
            {t("common.next", "Next")}
          </Button>
        </div>
      )}

      {/* Add/Edit Employee Dialog */}
      <EmployeeFormDialog
        open={isAddDialogOpen}
        onOpenChange={handleDialogChange}
        employee={selectedEmployee || undefined}
        readOnly={isReadOnly}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!employeeToDelete}
        onOpenChange={(open) => !open && setEmployeeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("employees.deleteTitle", "Delete Employee")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "employees.deleteConfirmation",
                "Are you sure you want to delete {{name}}? This action cannot be undone.",
                {
                  name: `${employeeToDelete?.firstName} ${employeeToDelete?.lastName}`,
                },
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("common.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {t("common.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
