import {
  Users,
  Clock,
  ClipboardList,
  Award,
  Building2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QuickAction {
  title: string;
  icon: LucideIcon;
  description: string;
}

const quickActions: QuickAction[] = [
  { title: "员工管理", icon: Users, description: "查看和管理员工信息" },
  { title: "考勤管理", icon: Clock, description: "考勤记录与统计" },
  { title: "请假审批", icon: ClipboardList, description: "处理员工请假申请" },
  { title: "绩效考核", icon: Award, description: "员工绩效评估" },
  { title: "部门管理", icon: Building2, description: "组织架构管理" },
  { title: "数据分析", icon: TrendingUp, description: "人力资源报表" },
];

export function QuickActions() {
  return (
    <Card className="border-0 bg-white shadow-lg shadow-slate-200/50 lg:col-span-2 dark:bg-slate-900 dark:shadow-slate-900/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
          快捷操作
        </CardTitle>
        <CardDescription>常用功能的快速入口</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="group h-auto flex-col items-start gap-2 border-slate-200 p-4 text-left transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-blue-100 dark:bg-slate-800 dark:group-hover:bg-blue-900/50">
                <action.icon className="size-5 text-slate-600 transition-colors group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {action.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
