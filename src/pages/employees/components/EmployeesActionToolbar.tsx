import { Filter, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeesActionToolbarProps {
  defaultSearchValue?: string;
  status?: string;
  onSearch: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function EmployeesActionToolbar({
  defaultSearchValue,
  status,
  onSearch,
  onStatusChange,
}: EmployeesActionToolbarProps) {
  const { t } = useTranslation();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    onSearch(search);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:flex-row sm:items-center">
      <form onSubmit={handleSearchSubmit} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          name="search"
          placeholder={t(
            "employees.searchPlaceholder",
            "Search by name or email...",
          )}
          defaultValue={defaultSearchValue}
          className="pl-10"
        />
      </form>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        <Select value={status || "all"} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t("employees.filterStatus", "Status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("employees.allStatuses", "All Statuses")}
            </SelectItem>
            <SelectItem value="Active">
              {t("employees.status.active", "Active")}
            </SelectItem>
            <SelectItem value="OnLeave">
              {t("employees.status.onLeave", "On Leave")}
            </SelectItem>
            <SelectItem value="Resigned">
              {t("employees.status.resigned", "Resigned")}
            </SelectItem>
            <SelectItem value="Terminated">
              {t("employees.status.terminated", "Terminated")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
