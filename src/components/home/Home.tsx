import { StatsCards } from "./StatsCards";
import { QuickActions } from "./QuickActions";
import { RecentActivities } from "./RecentActivities";
import { DepartmentStats } from "./DepartmentStats";

export function Home() {
  return (
    <>
      {/* 欢迎区域 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          欢迎回来，管理员 👋
        </h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          今天是 2026年1月24日，星期五。以下是您的工作概览。
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <QuickActions />
        <RecentActivities />
      </div>

      <DepartmentStats />
    </>
  );
}
