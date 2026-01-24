import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Calendar, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "进行中职位",
    value: "12",
    change: "+2 本周",
    icon: Briefcase,
    trend: "up",
  },
  {
    title: "活跃候选人",
    value: "45",
    change: "+15 本周",
    icon: Users,
    trend: "up",
  },
  {
    title: "今日面试",
    value: "3",
    change: "即将开始",
    icon: Calendar,
    trend: "neutral",
  },
  {
    title: "招聘完成率",
    value: "85%",
    change: "+5% 上月",
    icon: TrendingUp,
    trend: "up",
  },
];

export function RecruitmentStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
            <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'
              }`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
