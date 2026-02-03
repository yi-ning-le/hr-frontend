import { Outlet } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface AuthLayoutProps {
  className?: string;
}

export function AuthLayout({ className }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
        className
      )}
    >
      <div className="flex flex-1 w-full items-center justify-center px-4 py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <Outlet />
        </div>
      </div>
      {/* Language Switcher at the bottom */}
      <div className="flex justify-center pb-6">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
