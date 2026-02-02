import { useTranslation } from "react-i18next";

export function CalendarTab() {
  const { t } = useTranslation();

  return (
    <div className="flex h-100 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
      <div className="text-center">
        <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
          {t("recruitment.calendar.title")}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {t("recruitment.calendar.placeholder")}
        </p>
      </div>
    </div>
  );
}
