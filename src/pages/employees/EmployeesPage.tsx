import { useEffect } from "react";
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
import { useEmployeeStore } from "@/stores/useEmployeeStore";
import { useState } from "react";
import { EmployeeList } from "./components/EmployeeList";
import { EmployeeFormDialog } from "./components/EmployeeFormDialog";

export function EmployeesPage() {
  const { t } = useTranslation();
  const {
    employees,
    pagination,
    filters,
    isLoading,
    fetchEmployees,
    setFilters,
    setPage,
  } = useEmployeeStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || "");

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees, filters, pagination.page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchInput });
  };

  const handleStatusFilter = (value: string) => {
    setFilters({ status: value === "all" ? "" : (value as typeof filters.status) });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

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
            placeholder={t("employees.searchPlaceholder", "Search by name or email...")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </form>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select value={filters.status || "all"} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("employees.filterStatus", "Status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("employees.allStatuses", "All Statuses")}</SelectItem>
              <SelectItem value="Active">{t("employees.status.active", "Active")}</SelectItem>
              <SelectItem value="OnLeave">{t("employees.status.onLeave", "On Leave")}</SelectItem>
              <SelectItem value="Resigned">{t("employees.status.resigned", "Resigned")}</SelectItem>
              <SelectItem value="Terminated">{t("employees.status.terminated", "Terminated")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employee List */}
      <div className="rounded-xl bg-white shadow-sm dark:bg-slate-800">
        <EmployeeList employees={employees} isLoading={isLoading} />
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

      {/* Add Employee Dialog */}
      <EmployeeFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
