import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateStatusSettings } from "@/pages/settings/components/CandidateStatusSettings";

export function SettingsPage() {
  const { t } = useTranslation();

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

      <Tabs defaultValue="candidate-statuses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="candidate-statuses">
            {t("settings.tabs.candidateStatuses", "Candidate Statuses")}
          </TabsTrigger>
          <TabsTrigger value="general">
            {t("settings.tabs.general", "General")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="candidate-statuses" className="space-y-4">
          <CandidateStatusSettings />
        </TabsContent>
        <TabsContent value="general">
          <div className="settings-content min-h-[400px] rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 flex items-center justify-center text-muted-foreground">
            {t("settings.general.placeholder", "General Settings Placeholder")}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
