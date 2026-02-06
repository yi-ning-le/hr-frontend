import { useTranslation } from "react-i18next";

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

      <div className="settings-content min-h-[400px] rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50" />
    </div>
  );
}
