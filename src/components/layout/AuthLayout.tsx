import { Outlet } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface AuthLayoutProps {
  className?: string;
}

export function AuthLayout({ className }: AuthLayoutProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
        className,
      )}
    >
      <div className="flex flex-1 w-full items-center justify-center px-4 py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <Outlet />
        </div>
      </div>
      {/* Language Switcher at the bottom */}
      <div className="flex flex-col items-center gap-4 pb-6">
        <LanguageSwitcher />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("common.appName")}.{" "}
          {t("footer.copyright")}
        </p>
      </div>
    </div>
  );
}
