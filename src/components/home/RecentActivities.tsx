import { useTranslation } from "react-i18next";
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
  actionEn: string;
  time: string;
  timeEn: string;
  type: ActivityType;
}

const recentActivities: Activity[] = [
  {
    user: "张三",
    avatar: "",
    action: "提交了年假申请",
    actionEn: "submitted annual leave request",
    time: "5分钟前",
    timeEn: "5 minutes ago",
    type: "leave",
  },
  {
    user: "李四",
    avatar: "",
    action: "完成了入职手续",
    actionEn: "completed onboarding",
    time: "30分钟前",
    timeEn: "30 minutes ago",
    type: "onboard",
  },
  {
    user: "王五",
    avatar: "",
    action: "更新了个人信息",
    actionEn: "updated personal info",
    time: "1小时前",
    timeEn: "1 hour ago",
    type: "update",
  },
  {
    user: "赵六",
    avatar: "",
    action: "提交了报销申请",
    actionEn: "submitted expense claim",
    time: "2小时前",
    timeEn: "2 hours ago",
    type: "expense",
  },
];

export function RecentActivities() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh-CN';

  return (
    <Card className="border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-900 dark:shadow-slate-900/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
            {t("home.recentActivities.title")}
          </CardTitle>
          <CardDescription>{t("home.recentActivities.description")}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 dark:text-blue-400"
        >
          {t("common.viewAll")}
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
                    {isZh ? activity.action : activity.actionEn}
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {isZh ? activity.time : activity.timeEn}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="shrink-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                {t(`home.recentActivities.activityTypes.${activity.type}`)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
