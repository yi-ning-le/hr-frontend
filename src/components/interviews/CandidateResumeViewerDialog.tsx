import { FileText, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CandidateResumeSection } from "@/components/candidates/CandidateResumeSection";
import { PdfPreview } from "@/components/candidates/PdfPreview";
import { CandidateReviewPanel } from "@/components/candidates/reviews/CandidateReviewPanel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import type { Candidate } from "@/types/candidate";

interface CandidateResumeViewerDialogProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewSubmit?: () => void;
  onOpenInfo?: () => void;
}

export function CandidateResumeViewerDialog({
  candidate,
  open,
  onOpenChange,
  onReviewSubmit,
  onOpenInfo,
}: CandidateResumeViewerDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] w-full h-[95vh] flex flex-col p-0 overflow-hidden gap-0 border-none bg-transparent shadow-none sm:max-w-[95vw]"
        showCloseButton={false}
      >
        {/* Header Bar - Floating or Integrated */}
        <div className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border rounded-t-lg shadow-sm shrink-0 mx-auto w-full max-w-[1600px] flex items-center justify-between p-3 px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none">
                {candidate.name}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {candidate.appliedJobTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenInfo && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenInfo}
                className="h-8 rounded-full px-4"
              >
                <Info className="h-3.5 w-3.5 mr-2" />
                {t("candidate.viewInfo", "Info Card")}
              </Button>
            )}

            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* E-Book Container */}
        <div className="flex-1 min-h-0 mx-auto w-full max-w-400 bg-background border-x border-b rounded-b-lg shadow-2xl overflow-hidden flex flex-row">
          {/* Left Page: Resume */}
          <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 border-r relative min-w-0">
            {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
              <PdfPreview
                pdfUrl={candidate.resumeUrl}
                className="h-full border-0 rounded-none bg-transparent"
                showToolbar={true}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <CandidateResumeSection
                  candidate={candidate}
                  isUploadingResume={false}
                  onResumeUpload={() => {}}
                  onPreviewClick={() => {}}
                />
              </div>
            )}
          </div>

          {/* Right Page: Review Form */}
          <div className="w-[400px] xl:w-[450px] bg-background flex flex-col shrink-0 z-10 shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.05)]">
            <div className="h-full flex flex-col">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold">
                  {t("candidate.review", "Review Assessment")}
                </h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <CandidateReviewPanel
                  candidate={candidate}
                  onReviewSubmit={() => {
                    onReviewSubmit?.();
                    onOpenChange(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
