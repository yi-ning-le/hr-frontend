import { useTranslation } from "react-i18next"
import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileText, Briefcase, X } from "lucide-react"
import type { Candidate } from "@/types/candidate"
import { PdfPreview } from "./PdfPreview"
import { useJobStore } from "@/stores/useJobStore"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResumePreviewModalProps {
  candidate: Candidate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResumePreviewModal({ candidate, open, onOpenChange }: ResumePreviewModalProps) {
  const { t } = useTranslation()
  const { jobs } = useJobStore()
  const [jdOpen, setJdOpen] = useState(false)

  const job = useMemo(() => {
    if (!candidate) return null
    return jobs.find((j) => j.id === candidate.appliedJobId) || null
  }, [candidate, jobs])

  if (!candidate) return null

  // Ensure JD view is closed when reopening modal for different candidate
  // (Optional logic, or keep state if preferred)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-none w-auto h-[95vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center outline-none sm:max-w-none"
        showCloseButton={false} // We implement custom close button on the card
      >
        <div className="flex gap-4 h-full pointer-events-none">
          {/* Resume Card (Left) */}
          <div className={`
            bg-background border rounded-lg shadow-lg flex flex-col pointer-events-auto transition-all duration-300
            ${jdOpen ? "w-[45vw]" : "w-[60vw] max-w-4xl"}
            h-full
          `}>
            <DialogHeader className="p-4 border-b flex-shrink-0 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <DialogTitle>{t("resumeModal.resumeOf", { name: candidate.name })}</DialogTitle>
                  <div className="text-sm text-muted-foreground">
                    {candidate.appliedJobTitle} · {candidate.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {job && (
                  <Button
                    variant={jdOpen ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setJdOpen(!jdOpen)}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    {jdOpen ? t("resumeModal.hideJD") : t("resumeModal.viewJD")}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => window.open(candidate.resumeUrl, "_blank")}>
                  <Download className="h-4 w-4 mr-2" />
                  {t("resumeModal.download")}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 min-h-0 overflow-hidden p-4">
              {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
                <PdfPreview
                  url={candidate.resumeUrl}
                  showToolbar={true}
                  initialScale={1.2}
                  maxHeight="calc(95vh - 8rem)"
                  className="h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-slate-100 dark:bg-slate-900 text-muted-foreground space-y-4 rounded-lg">
                  <FileText className="h-16 w-16 opacity-20" />
                  <p>{t("resumeModal.noResume")}</p>
                </div>
              )}
            </div>
          </div>

          {/* JD Card (Right) */}
          {jdOpen && job && (
            <div className="w-[45vw] bg-background border rounded-lg shadow-lg flex flex-col pointer-events-auto h-full animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="p-4 border-b flex-shrink-0 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold leading-none tracking-tight">{t("resumeModal.jobDescription")}</h2>
                    <div className="text-sm text-muted-foreground mt-1">
                      {job.title} · {job.department}
                    </div>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {job.jobDescription}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
