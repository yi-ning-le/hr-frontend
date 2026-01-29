export function CalendarTab() {
  return (
    <div className="flex h-100 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
      <div className="text-center">
        <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
          面试日历
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          在此展示面试安排日程。
        </p>
      </div>
    </div>
  );
}
