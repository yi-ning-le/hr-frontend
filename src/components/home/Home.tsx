import { Header } from "./Header";
import { StatsCards } from "./StatsCards";
import { QuickActions } from "./QuickActions";
import { RecentActivities } from "./RecentActivities";
import { DepartmentStats } from "./DepartmentStats";
import { Footer } from "./Footer";

export function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
      </main>

      <Footer />
    </div>
  );
}
