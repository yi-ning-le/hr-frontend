import { Link, useNavigate } from "@tanstack/react-router";
import { Building2, Bell, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success(t("header.logoutSuccess"));
      navigate({ to: "/login" });
    } else {
      toast.error(t("header.logoutFailed"), {
        description: result.error || t("header.retryLater"),
      });
    }
  };

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
                {t("common.appName")}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("common.appSubtitle")}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white [&.active]:bg-slate-100 [&.active]:text-slate-900 dark:[&.active]:bg-slate-800 dark:[&.active]:text-white"
            >
              {t("nav.overview")}
            </Link>
            <Link
              to="/recruitment"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white [&.active]:bg-slate-100 [&.active]:text-slate-900 dark:[&.active]:bg-slate-800 dark:[&.active]:text-white"
            >
              {t("nav.recruitment")}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="size-9 ring-2 ring-slate-200 ring-offset-2 dark:ring-slate-700">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
                    {user?.username?.slice(0, 2).toUpperCase() || "User"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.username || t("header.admin")}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 size-4" />
                <span>{t("header.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                <span>{t("header.settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 size-4" />
                <span>{t("header.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
