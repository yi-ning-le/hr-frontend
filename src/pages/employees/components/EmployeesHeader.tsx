import { RefreshCcw, UserPlus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface EmployeesHeaderProps {
  total: number;
  isHR: boolean;
  onRefresh: () => void;
  onAdd: () => void;
}

export function EmployeesHeader({
  total,
  isHR,
  onRefresh,
  onAdd,
}: EmployeesHeaderProps) {
  const { t } = useTranslation();

  return (
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
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground mr-4">
          {t("common.total", "Total")}: {total}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          title={t("common.refresh", "Refresh")}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        {isHR && (
          <Button onClick={onAdd} className="gap-2">
            <UserPlus className="h-4 w-4" />
            {t("employees.addEmployee", "Add Employee")}
          </Button>
        )}
      </div>
    </div>
  );
}
