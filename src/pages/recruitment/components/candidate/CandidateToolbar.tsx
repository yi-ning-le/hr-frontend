import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CandidateToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CandidateToolbar({
  searchQuery,
  onSearchChange,
}: CandidateToolbarProps) {
  return (
    <div className="p-4 border-b flex items-center justify-between gap-4">
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
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          状态筛选
        </Button>
      </div>
    </div>
  );
}
