import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RecruitmentHeaderProps {
  onAddJob: () => void;
}

export function RecruitmentHeader({ onAddJob }: RecruitmentHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          招聘管理
        </h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          管理职位发布、候选人跟进及招聘数据分析
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
          onClick={onAddJob}
        >
          <Plus className="mr-2 h-4 w-4" />
          发布新职位
        </Button>
      </div>
    </div>
  );
}
