import { useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Maximize2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { JobPosition } from "@/types/job"

interface JobPositionDetailProps {
  job: JobPosition
}

function ExpandableText({ title, content, className }: { title: string; content: string; className?: string }) {
  const [isFullScreen, setIsFullScreen] = useState(false)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsFullScreen(true)}
          title="全屏查看"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className={cn("rounded-md border bg-muted/50 p-4 text-sm whitespace-pre-wrap overflow-y-auto", className)}>
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
  )
}

export function JobPositionDetail({ job }: JobPositionDetailProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">职位名称</h4>
          <p className="text-sm font-medium leading-none">{job.title}</p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">状态</h4>
          <Badge variant={job.status === "OPEN" ? "default" : "secondary"}>
            {job.status === "OPEN" ? "招聘中" : "已关闭"}
          </Badge>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">部门</h4>
          <p className="text-sm font-medium leading-none">{job.department}</p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">需求人数</h4>
          <p className="text-sm font-medium leading-none">{job.headCount} 人</p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">启动日期</h4>
          <p className="text-sm font-medium leading-none">
            {job.openDate ? format(job.openDate, "yyyy-MM-dd") : "-"}
          </p>
        </div>
      </div>

      <ExpandableText title="职位描述 (JD)" content={job.jobDescription} className="h-[200px]" />

      {job.note && (
        <ExpandableText title="备注" content={job.note} className="h-[80px]" />
      )}
    </div>
  )
}
