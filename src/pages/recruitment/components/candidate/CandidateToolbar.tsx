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
import type { CandidateStatus } from "@/types/candidate";

interface CandidateToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: CandidateStatus[];
  onStatusFilterChange: (status: CandidateStatus[]) => void;
}

const STATUS_OPTIONS: { label: string; value: CandidateStatus }[] = [
  { label: "New", value: "new" },
  { label: "Screening", value: "screening" },
  { label: "Interview", value: "interview" },
  { label: "Offer", value: "offer" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
];

export function CandidateToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CandidateToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索候选人姓名或邮箱..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                状态筛选
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
            <DropdownMenuLabel>筛选状态</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUS_OPTIONS.map((option) => {
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
                        statusFilter.filter((s) => s !== option.value)
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
                  清除筛选
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

