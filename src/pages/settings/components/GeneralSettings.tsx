import { useTranslation } from "react-i18next";

export function GeneralSettings() {
  const { t } = useTranslation();

  return (
    <div className="settings-content min-h-[400px] rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 flex items-center justify-center text-muted-foreground">
      {t("settings.general.placeholder", "General Settings Placeholder")}
    </div>
  );
}
