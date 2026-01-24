import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
}

const stats: StatItem[] = [
  {
    title: "员工总数",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "本月入职",
    value: "28",
    change: "+8%",
    trend: "up",
    icon: UserPlus,
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "待审批请假",
    value: "15",
    change: "-3%",
    trend: "down",
    icon: Calendar,
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "今日出勤率",
    value: "96.5%",
    change: "+2.1%",
    trend: "up",
    icon: Clock,
    color: "from-violet-500 to-purple-600",
  },
];

export function StatsCards() {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="group relative overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:shadow-slate-900/50"
        >
          <div
            className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
          />
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp
                    className={`size-4 ${
                      stat.trend === "up"
                        ? "text-emerald-500"
                        : "rotate-180 text-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    较上月
                  </span>
                </div>
              </div>
              <div
                className={`flex size-12 items-center justify-center rounded-xl bg-linear-to-br ${stat.color} shadow-lg`}
              >
                <stat.icon className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
