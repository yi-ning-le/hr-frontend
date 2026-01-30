import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileText, Maximize2 } from "lucide-react"
import type { Candidate } from "@/types/candidate"

interface ResumePreviewModalProps {
  candidate: Candidate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResumePreviewModal({ candidate, open, onOpenChange }: ResumePreviewModalProps) {
  if (!candidate) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <DialogTitle>{candidate.name} 的简历</DialogTitle>
              <div className="text-sm text-muted-foreground">
                {candidate.appliedJobTitle} · {candidate.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-8">
            <Button variant="outline" size="sm" onClick={() => window.open(candidate.resumeUrl, "_blank")}>
              <Download className="h-4 w-4 mr-2" />
              下载
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-md overflow-hidden border">
          {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
            <iframe
              src={candidate.resumeUrl}
              className="w-full h-full"
              title="Resume Preview"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
              <FileText className="h-16 w-16 opacity-20" />
              <p>预览不可用 (Mock URL)</p>
              <Button variant="link" onClick={() => window.open(candidate.resumeUrl, "_blank")}>
                尝试在新窗口打开
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
