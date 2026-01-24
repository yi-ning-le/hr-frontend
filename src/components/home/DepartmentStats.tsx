import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DepartmentStat {
  name: string;
  count: number;
  percentage: number;
}

const departmentStats: DepartmentStat[] = [
  { name: "技术部", count: 156, percentage: 35 },
  { name: "产品部", count: 89, percentage: 20 },
  { name: "市场部", count: 67, percentage: 15 },
  { name: "运营部", count: 78, percentage: 17 },
  { name: "人事部", count: 58, percentage: 13 },
];

export function DepartmentStats() {
  return (
    <Card className="mt-6 border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-900 dark:shadow-slate-900/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
          部门人员分布
        </CardTitle>
        <CardDescription>各部门员工数量及占比</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {departmentStats.map((dept) => (
            <div
              key={dept.name}
              className="rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:hover:border-blue-800"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-slate-900 dark:text-white">
                  {dept.name}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {dept.count}人
                </span>
              </div>
              <Progress value={dept.percentage} className="h-2" />
              <p className="mt-2 text-right text-xs text-slate-500 dark:text-slate-400">
                占比 {dept.percentage}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
