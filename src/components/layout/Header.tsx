import { Link } from "@tanstack/react-router";
import { Building2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
              <Building2 className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                HR System
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                人力资源管理系统
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white [&.active]:bg-slate-100 [&.active]:text-slate-900 dark:[&.active]:bg-slate-800 dark:[&.active]:text-white"
            >
              概览
            </Link>
            <Link
              to="/recruitment"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white [&.active]:bg-slate-100 [&.active]:text-slate-900 dark:[&.active]:bg-slate-800 dark:[&.active]:text-white"
            >
              招聘管理
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              3
            </span>
          </Button>
          <Avatar className="size-9 ring-2 ring-slate-200 ring-offset-2 dark:ring-slate-700">
            <AvatarImage src="" />
            <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
              管
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
