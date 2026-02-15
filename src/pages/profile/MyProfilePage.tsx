import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyEmployeeProfile } from "@/hooks/queries/useEmployees";
import { EmployeeProfileView } from "@/pages/employees/components/EmployeeProfileView";

export function MyProfilePage() {
  const { t } = useTranslation();
  const { data: employee, isLoading, isError } = useMyEmployeeProfile();

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
          {t("employees.notFound", "Profile not found")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {t("header.profile", "Profile")}
      </h1>
      <EmployeeProfileView employee={employee} />
    </div>
  );
}
