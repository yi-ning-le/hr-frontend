import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ActivityType = "leave" | "onboard" | "update" | "expense";

interface Activity {
  user: string;
  avatar: string;
  action: string;
  time: string;
  type: ActivityType;
}

const recentActivities: Activity[] = [
  {
    user: "张三",
    avatar: "",
    action: "提交了年假申请",
    time: "5分钟前",
    type: "leave",
  },
  {
    user: "李四",
    avatar: "",
    action: "完成了入职手续",
    time: "30分钟前",
    type: "onboard",
  },
  {
    user: "王五",
    avatar: "",
    action: "更新了个人信息",
    time: "1小时前",
    type: "update",
  },
  {
    user: "赵六",
    avatar: "",
    action: "提交了报销申请",
    time: "2小时前",
    type: "expense",
  },
];

const activityTypeLabels: Record<ActivityType, string> = {
  leave: "请假",
  onboard: "入职",
  update: "更新",
  expense: "报销",
};

export function RecentActivities() {
  return (
    <Card className="border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-900 dark:shadow-slate-900/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
            最近活动
          </CardTitle>
          <CardDescription>员工动态更新</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 dark:text-blue-400"
        >
          查看全部
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <Avatar className="size-9">
                <AvatarImage src={activity.avatar} />
                <AvatarFallback className="bg-linear-to-br from-slate-200 to-slate-300 text-sm font-medium text-slate-600 dark:from-slate-700 dark:to-slate-600 dark:text-slate-300">
                  {activity.user[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-slate-900 dark:text-white">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-slate-600 dark:text-slate-400">
                    {activity.action}
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {activity.time}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="shrink-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                {activityTypeLabels[activity.type]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
