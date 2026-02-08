import { Briefcase, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [jobs, searchQuery]);

  const groupedJobs = useMemo(() => {
    const groups: Record<string, JobPosition[]> = {};
    filteredJobs.forEach((job) => {
      const dept = job.department || t("common.uncategorized");
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(job);
    });
    return groups;
  }, [filteredJobs, t]);

  const departments = useMemo(
    () => Object.keys(groupedJobs).sort(),
    [groupedJobs],
  );

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Automatically expand departments when they are first loaded
  useEffect(() => {
    if (departments.length > 0 && expandedItems.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedItems(departments);
    }
  }, [departments, expandedItems.length]);

  return (
    <div className="w-64 border-r bg-slate-50/50 dark:bg-slate-900/50 flex flex-col">
      <div className="p-4 border-b space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          {t("recruitment.candidates.sidebar.title")}
        </h3>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("recruitment.candidates.sidebar.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-1">
          <Button
            variant={selectedJobId === "all" ? "secondary" : "ghost"}
            className="w-full justify-between mb-2"
            onClick={() => onSelectJob("all")}
          >
            <span className="truncate">
              {t("recruitment.candidates.sidebar.allPositions")}
            </span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {totalCandidates}
            </Badge>
          </Button>

          <div className="py-2 px-2">
            <Separator className="mb-4 bg-slate-200 dark:bg-slate-800" />
          </div>

          <Accordion
            type="multiple"
            value={expandedItems}
            onValueChange={setExpandedItems}
            className="w-full"
          >
            {departments.map((dept) => (
              <AccordionItem key={dept} value={dept} className="border-none">
                <AccordionTrigger className="hover:no-underline py-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {dept}
                  <Badge
                    variant="outline"
                    className="ml-auto text-[10px] font-normal"
                  >
                    {groupedJobs[dept].reduce(
                      (acc, job) => acc + (jobCounts[job.id] || 0),
                      0,
                    )}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="space-y-1">
                    {groupedJobs[dept].map((job) => (
                      <Button
                        key={job.id}
                        variant={
                          selectedJobId === job.id ? "secondary" : "ghost"
                        }
                        className={cn(
                          "w-full justify-between h-9 px-2 pl-4 text-sm font-normal",
                          selectedJobId === job.id && "bg-secondary",
                        )}
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
