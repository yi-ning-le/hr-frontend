import { format } from "date-fns";
import { Maximize2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { JobPosition } from "@/types/job";

interface JobPositionDetailProps {
  job: JobPosition;
}

function ExpandableText({
  title,
  content,
  className,
  fullscreenLabel,
}: {
  title: string;
  content: string;
  className?: string;
  fullscreenLabel: string;
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsFullScreen(true)}
          title={fullscreenLabel}
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div
        className={cn(
          "rounded-md border bg-muted/50 p-4 text-sm whitespace-pre-wrap overflow-y-auto",
          className,
        )}
      >
        {content}
      </div>

      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-1 text-sm whitespace-pre-wrap">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function JobPositionDetail({ job }: JobPositionDetailProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("recruitment.jobs.name")}
          </h4>
          <p className="text-sm font-medium leading-none">{job.title}</p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("recruitment.jobs.status")}
          </h4>
          <Badge variant={job.status === "OPEN" ? "default" : "secondary"}>
            {job.status === "OPEN"
              ? t("recruitment.jobs.statusOptions.open")
              : t("recruitment.jobs.statusOptions.closed")}
          </Badge>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("recruitment.jobs.department")}
          </h4>
          <p className="text-sm font-medium leading-none">{job.department}</p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("recruitment.jobs.headCount")}
          </h4>
          <p className="text-sm font-medium leading-none">
            {job.headCount} {t("recruitment.jobs.detail.headCountUnit")}
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("recruitment.jobs.openDate")}
          </h4>
          <p className="text-sm font-medium leading-none">
            {job.openDate ? format(job.openDate, "yyyy-MM-dd") : "-"}
          </p>
        </div>
      </div>

      <ExpandableText
        title={t("recruitment.jobs.detail.jobDescription")}
        content={job.jobDescription}
        className="h-[200px]"
        fullscreenLabel={t("recruitment.jobs.detail.fullscreen")}
      />

      {job.note && (
        <ExpandableText
          title={t("recruitment.jobs.note")}
          content={job.note}
          className="h-[80px]"
          fullscreenLabel={t("recruitment.jobs.detail.fullscreen")}
        />
      )}
    </div>
  );
}
