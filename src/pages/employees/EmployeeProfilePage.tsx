import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployee } from "@/hooks/queries/useEmployees";
import { EmployeeProfileView } from "@/pages/employees/components/EmployeeProfileView";
import { Route } from "@/routes/_protected/employees.$employeeId";

export function EmployeeProfilePage() {
  const { t } = useTranslation();
  const { employeeId } = Route.useParams();
  const returnSearch = Route.useSearch();
  const { data: employee, isLoading, isError } = useEmployee(employeeId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-xl font-semibold text-slate-900 dark:text-white">
          {t("employees.notFound", "Employee not found")}
        </p>
        <Link to="/employees" search={returnSearch}>
          <Button variant="outline">{t("common.back", "Back to List")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/employees" search={returnSearch}>
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("common.back", "Back")}
        </Button>
      </Link>

      <EmployeeProfileView employee={employee} />
    </div>
  );
}
