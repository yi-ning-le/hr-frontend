import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateStatusSettings } from "@/pages/settings/components/CandidateStatusSettings";
import { GeneralSettings } from "@/pages/settings/components/GeneralSettings";

export function SettingsPage() {
  const { t } = useTranslation();

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
  ] as const;

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

      <Tabs defaultValue={TABS[0].id} className="space-y-4">
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
