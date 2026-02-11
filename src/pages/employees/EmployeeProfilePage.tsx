import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployees } from "@/hooks/queries/useEmployees";
import { Route } from "@/routes/_protected/employees.$employeeId";

export function EmployeeProfilePage() {
  const { t } = useTranslation();
  const { employeeId } = Route.useParams();
  const { data, isLoading } = useEmployees();

  const employee = useMemo(
    () => data?.employees.find((e) => e.id === employeeId) ?? null,
    [data?.employees, employeeId],
  );

  if (isLoading || !employee) {
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

  const getStatusVariant = (status: typeof employee.status) => {
    switch (status) {
      case "Active":
        return "default";
      case "OnLeave":
        return "secondary";
      default:
        return "destructive";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/employees" search={{ page: 1, limit: 20 }}>
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("common.back", "Back")}
        </Button>
      </Link>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardContent className="flex flex-col items-center pt-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                {employee.firstName[0]}
                {employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {employee.position}
            </p>
            <Badge variant={getStatusVariant(employee.status)} className="mt-2">
              {employee.status}
            </Badge>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("employees.details", "Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("employees.form.email", "Email")}
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {employee.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("employees.form.phone", "Phone")}
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {employee.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("employees.form.department", "Department")}
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {employee.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("employees.form.employmentType", "Employment Type")}
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {employee.employmentType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("employees.form.joinDate", "Join Date")}
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(employee.joinDate))}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
