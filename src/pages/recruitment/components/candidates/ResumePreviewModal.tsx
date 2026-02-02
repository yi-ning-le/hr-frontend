import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import type { Candidate } from "@/types/candidate"
import { PdfPreview } from "./PdfPreview"

interface ResumePreviewModalProps {
  candidate: Candidate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResumePreviewModal({ candidate, open, onOpenChange }: ResumePreviewModalProps) {
  const { t } = useTranslation()

  if (!candidate) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col p-4">
        <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <DialogTitle>{t("resumeModal.resumeOf", { name: candidate.name })}</DialogTitle>
              <div className="text-sm text-muted-foreground">
                {candidate.appliedJobTitle} · {candidate.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-8">
            <Button variant="outline" size="sm" onClick={() => window.open(candidate.resumeUrl, "_blank")}>
              <Download className="h-4 w-4 mr-2" />
              {t("resumeModal.download")}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden rounded-lg">
          {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
            <PdfPreview
              url={candidate.resumeUrl}
              showToolbar={true}
              initialScale={1.2}
              maxHeight="calc(95vh - 100px)"
              className="h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-slate-100 dark:bg-slate-900 text-muted-foreground space-y-4 rounded-lg">
              <FileText className="h-16 w-16 opacity-20" />
              <p>{t("resumeModal.noResume")}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
