import { useTranslation } from "react-i18next";
import { DepartmentStats } from "./DepartmentStats";
import { QuickActions } from "./QuickActions";
import { RecentActivities } from "./RecentActivities";
import { StatsCards } from "./StatsCards";

export function Home() {
  const { t, i18n } = useTranslation();

  const formatDate = () => {
    const date = new Date();
    if (i18n.language === "zh-CN") {
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    }
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Welcome section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {t("home.welcome")}
        </h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {t("home.todayInfo", { date: formatDate() })}
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
