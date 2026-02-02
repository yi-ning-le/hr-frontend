import { useTranslation } from "react-i18next";
import { RecruitmentStats } from "./RecruitmentStats";
import { RecentApplications } from "./RecentApplications";

export function OverviewTab() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <RecruitmentStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RecentApplications />

        {/* Quick Actions / Pipeline Placeholder */}
        <div className="space-y-6">
          {/* Recruitment Pipeline Funnel Placeholder */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
              {t("recruitment.overview.funnel.title")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{t("recruitment.overview.funnel.screening")}</span>
                <span className="font-bold">120</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-full"></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{t("recruitment.overview.funnel.firstInterview")}</span>
                <span className="font-bold">45</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[37%]"></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{t("recruitment.overview.funnel.secondInterview")}</span>
                <span className="font-bold">12</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[10%]"></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{t("recruitment.overview.funnel.offer")}</span>
                <span className="font-bold">5</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[4%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
