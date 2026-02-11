import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRole } from "@/hooks/useUserRole";
import { CandidateStatusSettings } from "@/pages/settings/components/CandidateStatusSettings";
import { GeneralSettings } from "@/pages/settings/components/GeneralSettings";
import { HRManagement } from "@/pages/settings/components/HRManagement";
import { RecruiterManagement } from "@/pages/settings/components/RecruiterManagement";
import {
  SETTINGS_TABS,
  SettingsTabId,
  type SettingsTabIdType,
} from "./constants";

export interface SettingsPageProps {
  activeTab?: SettingsTabIdType;
  onTabChange?: (tab: SettingsTabIdType) => void;
}

export function SettingsPage({ activeTab, onTabChange }: SettingsPageProps) {
  const { t } = useTranslation();
  const { isAdmin } = useUserRole();

  const TABS = SETTINGS_TABS.filter((tab) => {
    if ("adminOnly" in tab && tab.adminOnly) {
      return isAdmin;
    }
    return true;
  }).map((tab) => ({
    ...tab,
    label: t(tab.labelKey, tab.defaultLabel),
    component: {
      [SettingsTabId.CandidateStatuses]: <CandidateStatusSettings />,
      [SettingsTabId.General]: <GeneralSettings />,
      [SettingsTabId.Recruiters]: <RecruiterManagement />,
      [SettingsTabId.HRManagement]: <HRManagement />,
    }[tab.id],
  }));

  const defaultTab = SettingsTabId.CandidateStatuses;

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
        onValueChange={(value) => onTabChange?.(value as SettingsTabIdType)}
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
