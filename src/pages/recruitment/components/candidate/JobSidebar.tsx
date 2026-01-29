import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { JobPosition } from "@/types/job";

interface JobSidebarProps {
  jobs: JobPosition[];
  selectedJobId: string | "all";
  onSelectJob: (jobId: string | "all") => void;
  jobCounts: Record<string, number>;
  totalCandidates: number;
}

export function JobSidebar({
  jobs,
  selectedJobId,
  onSelectJob,
  jobCounts,
  totalCandidates,
}: JobSidebarProps) {
  return (
    <div className="w-64 border-r bg-slate-50/50 dark:bg-slate-900/50 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          职位筛选
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <Button
            variant={selectedJobId === "all" ? "secondary" : "ghost"}
            className="w-full justify-between"
            onClick={() => onSelectJob("all")}
          >
            <span className="truncate">全部职位</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {totalCandidates}
            </Badge>
          </Button>
          {jobs.map((job) => (
            <Button
              key={job.id}
              variant={selectedJobId === job.id ? "secondary" : "ghost"}
              className="w-full justify-between"
              onClick={() => onSelectJob(job.id)}
            >
              <span className="truncate" title={job.title}>
                {job.title}
              </span>
              <Badge variant="outline" className="ml-auto text-xs">
                {jobCounts[job.id] || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
