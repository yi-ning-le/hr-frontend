import { useTranslation } from "react-i18next";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AddCandidateDialog } from "./AddCandidateDialog";
import type { CandidateStatus } from "@/types/candidate";
import { useCandidateStatuses } from "@/hooks/useCandidateStatuses";

interface CandidateToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: CandidateStatus[];
  onStatusFilterChange: (status: CandidateStatus[]) => void;
}

export function CandidateToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CandidateToolbarProps) {
  const { t } = useTranslation();
  const { statuses } = useCandidateStatuses();

  const statusOptions = statuses.map((status) => ({
    value: status.slug,
    label:
      status.type === "system"
        ? t(`recruitment.candidates.statusOptions.${status.slug}`, status.name)
        : status.name,
  }));

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("recruitment.candidates.toolbar.searchPlaceholder")}
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <AddCandidateDialog />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {t("recruitment.candidates.toolbar.statusFilter")}
              </span>
              {statusFilter.length > 0 && (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {statusFilter.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>
              {t("recruitment.candidates.toolbar.filterStatus")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((option) => {
              const isSelected = statusFilter.includes(option.value);
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onStatusFilterChange([...statusFilter, option.value]);
                    } else {
                      onStatusFilterChange(
                        statusFilter.filter((s) => s !== option.value),
                      );
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              );
            })}
            {statusFilter.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  onCheckedChange={() => onStatusFilterChange([])}
                  className="justify-center text-center"
                >
                  {t("common.clearFilter")}
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
