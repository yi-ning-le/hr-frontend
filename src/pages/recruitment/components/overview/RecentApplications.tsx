import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentApplications = [
  {
    id: 1,
    name: "张伟",
    role: "高级前端工程师",
    appliedDate: "2小时前",
    status: "new",
    avatar: "",
  },
  {
    id: 2,
    name: "李娜",
    role: "产品经理",
    appliedDate: "4小时前",
    status: "reviewing",
    avatar: "",
  },
  {
    id: 3,
    name: "王强",
    role: "UI设计师",
    appliedDate: "1天前",
    status: "interview",
    avatar: "",
  },
  {
    id: 4,
    name: "赵敏",
    role: "后端开发工程师",
    appliedDate: "1天前",
    status: "new",
    avatar: "",
  },
];

export function RecentApplications() {
  const { t } = useTranslation();

  const statusMap: Record<
    string,
    {
      labelKey: string;
      variant: "default" | "secondary" | "outline" | "destructive" | null;
    }
  > = {
    new: {
      labelKey: "recruitment.candidates.statusOptions.new",
      variant: "default",
    },
    reviewing: {
      labelKey: "recruitment.candidates.statusOptions.screening",
      variant: "secondary",
    },
    interview: {
      labelKey: "recruitment.candidates.statusOptions.interview",
      variant: "outline",
    },
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">
          {t("recruitment.overview.recentApplications.title")}
        </CardTitle>
        <Button variant="ghost" size="sm">
          {t("common.viewAll")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentApplications.map((app) => (
            <div key={app.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={app.avatar} />
                  <AvatarFallback>{app.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">
                    {app.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t("recruitment.overview.recentApplications.appliedFor")}{" "}
                    {app.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    statusMap[app.status]?.variant as
                      | "default"
                      | "secondary"
                      | "outline"
                      | "destructive"
                      | null
                      | undefined
                  }
                  className="hidden sm:flex"
                >
                  {t(statusMap[app.status]?.labelKey)}
                </Badge>
                <div className="text-xs text-slate-400 w-16 text-right">
                  {app.appliedDate}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
