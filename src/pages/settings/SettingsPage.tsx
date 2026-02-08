import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateStatusSettings } from "@/pages/settings/components/CandidateStatusSettings";
import { GeneralSettings } from "@/pages/settings/components/GeneralSettings";
import { RecruiterManagement } from "@/pages/settings/components/RecruiterManagement";
import { HRManagement } from "@/pages/settings/components/HRManagement";
import { useUserRole } from "@/hooks/useUserRole";

export interface SettingsPageProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function SettingsPage({ activeTab, onTabChange }: SettingsPageProps) {
  const { t } = useTranslation();
  const { isAdmin } = useUserRole();

  const TABS = [
    {
      id: "candidate-statuses",
      label: t("settings.tabs.candidateStatuses", "Candidate Statuses"),
      component: <CandidateStatusSettings />,
    },
    {
      id: "general",
      label: t("settings.tabs.general", "General"),
      component: <GeneralSettings />,
    },
    // Admin-only tabs
    ...(isAdmin
      ? [
          {
            id: "recruiters",
            label: t("settings.tabs.recruiters", "Recruiters"),
            component: <RecruiterManagement />,
          },
          {
            id: "hr-management",
            label: t("settings.tabs.hrManagement", "HR Management"),
            component: <HRManagement />,
          },
        ]
      : []),
  ];

  const defaultTab = TABS[0]?.id;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("settings.title", "Settings")}
        </h2>
        <p className="text-muted-foreground">
          {t(
            "settings.description",
            "Manage your account settings and preferences.",
          )}
        </p>
      </div>

      <Tabs
        defaultValue={defaultTab}
        value={activeTab}
        onValueChange={onTabChange}
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
