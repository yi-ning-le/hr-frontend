import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HRManagement } from "@/pages/settings/components/HRManagement";
import { RecruiterManagement } from "@/pages/settings/components/RecruiterManagement";
import { AdminTabId, type AdminTabIdType } from "./constants";

export interface AdminPageProps {
  activeTab?: AdminTabIdType;
  onTabChange?: (tab: AdminTabIdType) => void;
}

export function AdminPage({ activeTab, onTabChange }: AdminPageProps) {
  const { t } = useTranslation();

  const TABS = [
    {
      id: AdminTabId.Recruiters,
      label: t("settings.tabs.recruiters", "Recruiters"),
      component: <RecruiterManagement />,
    },
    {
      id: AdminTabId.HRManagement,
      label: t("settings.tabs.hrManagement", "HR Management"),
      component: <HRManagement />,
    },
  ];

  const defaultTab = AdminTabId.Recruiters;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("admin.title", "System Administration")}
        </h2>
        <p className="text-muted-foreground">
          {t("admin.description", "Manage recruitment roles and HR staff.")}
        </p>
      </div>

      <Tabs
        defaultValue={defaultTab}
        value={activeTab || defaultTab}
        onValueChange={(value) => onTabChange?.(value as AdminTabIdType)}
        className="space-y-4"
      >
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
