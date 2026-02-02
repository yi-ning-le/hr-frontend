import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DepartmentStat {
  nameKey: string;
  count: number;
  percentage: number;
}

const departmentStats: DepartmentStat[] = [
  { nameKey: "home.departmentStats.departments.tech", count: 156, percentage: 35 },
  { nameKey: "home.departmentStats.departments.product", count: 89, percentage: 20 },
  { nameKey: "home.departmentStats.departments.marketing", count: 67, percentage: 15 },
  { nameKey: "home.departmentStats.departments.operations", count: 78, percentage: 17 },
  { nameKey: "home.departmentStats.departments.hr", count: 58, percentage: 13 },
];

export function DepartmentStats() {
  const { t } = useTranslation();

  return (
    <Card className="mt-6 border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-900 dark:shadow-slate-900/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
          {t("home.departmentStats.title")}
        </CardTitle>
        <CardDescription>{t("home.departmentStats.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {departmentStats.map((dept) => (
            <div
              key={dept.nameKey}
              className="rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:hover:border-blue-800"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-slate-900 dark:text-white">
                  {t(dept.nameKey)}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {dept.count}{t("common.people")}
                </span>
              </div>
              <Progress value={dept.percentage} className="h-2" />
              <p className="mt-2 text-right text-xs text-slate-500 dark:text-slate-400">
                {t("common.percentage")} {dept.percentage}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
