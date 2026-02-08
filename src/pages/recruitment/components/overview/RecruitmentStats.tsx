import { Briefcase, Calendar, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecruitmentStats() {
  const { t } = useTranslation();

  const stats = [
    {
      titleKey: "recruitment.stats.activeJobs",
      value: "12",
      changeKey: "recruitment.stats.thisWeek",
      changeValue: "+2",
      icon: Briefcase,
      trend: "up",
    },
    {
      titleKey: "recruitment.stats.activeCandidates",
      value: "45",
      changeKey: "recruitment.stats.thisWeek",
      changeValue: "+15",
      icon: Users,
      trend: "up",
    },
    {
      titleKey: "recruitment.stats.todayInterviews",
      value: "3",
      changeKey: "recruitment.stats.upcoming",
      changeValue: "",
      icon: Calendar,
      trend: "neutral",
    },
    {
      titleKey: "recruitment.stats.completionRate",
      value: "85%",
      changeKey: "recruitment.stats.lastMonth",
      changeValue: "+5%",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.titleKey} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t(stat.titleKey)}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </div>
            <p
              className={`text-xs ${
                stat.trend === "up"
                  ? "text-green-600 dark:text-green-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {stat.changeValue} {t(stat.changeKey)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
