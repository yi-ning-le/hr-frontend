import { useTranslation } from "react-i18next";
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
  titleKey: string;
  icon: LucideIcon;
  descriptionKey: string;
}

const quickActions: QuickAction[] = [
  { titleKey: "home.quickActions.employeeManagement", icon: Users, descriptionKey: "home.quickActions.employeeManagementDesc" },
  { titleKey: "home.quickActions.attendanceManagement", icon: Clock, descriptionKey: "home.quickActions.attendanceManagementDesc" },
  { titleKey: "home.quickActions.leaveApproval", icon: ClipboardList, descriptionKey: "home.quickActions.leaveApprovalDesc" },
  { titleKey: "home.quickActions.performance", icon: Award, descriptionKey: "home.quickActions.performanceDesc" },
  { titleKey: "home.quickActions.departmentManagement", icon: Building2, descriptionKey: "home.quickActions.departmentManagementDesc" },
  { titleKey: "home.quickActions.dataAnalysis", icon: TrendingUp, descriptionKey: "home.quickActions.dataAnalysisDesc" },
];

export function QuickActions() {
  const { t } = useTranslation();

  return (
    <Card className="border-0 bg-white shadow-lg shadow-slate-200/50 lg:col-span-2 dark:bg-slate-900 dark:shadow-slate-900/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
          {t("home.quickActions.title")}
        </CardTitle>
        <CardDescription>{t("home.quickActions.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Button
              key={action.titleKey}
              variant="outline"
              className="group h-auto flex-col items-start gap-2 border-slate-200 p-4 text-left transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-blue-100 dark:bg-slate-800 dark:group-hover:bg-blue-900/50">
                <action.icon className="size-5 text-slate-600 transition-colors group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {t(action.titleKey)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t(action.descriptionKey)}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
