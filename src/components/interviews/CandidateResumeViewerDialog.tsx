import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { FileText, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CandidateResumeSection } from "@/components/candidates/CandidateResumeSection";
import { PdfPreview } from "@/components/candidates/PdfPreview";
import { CandidateReviewPanel } from "@/components/candidates/reviews/CandidateReviewPanel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
        className="w-[95vw] h-[95vh] max-w-none p-0 gap-0 border-none shadow-2xl bg-background flex flex-col"
        showCloseButton={false}
      >
        <VisuallyHidden.Root>
          <DialogTitle>
            {t("candidate.resumeViewerTitle", "Candidate Resume")}:{" "}
            {candidate.name}
          </DialogTitle>
          <DialogDescription>
            {t(
              "candidate.resumeViewerDesc",
              "View and review candidate resume",
            )}
          </DialogDescription>
        </VisuallyHidden.Root>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0 bg-muted/10">
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

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Page: Resume */}
          <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 relative min-w-0 flex flex-col">
            {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
              <PdfPreview
                pdfUrl={candidate.resumeUrl}
                className="flex-1 w-full border-0 rounded-none bg-transparent"
                showToolbar={true}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md">
                  <CandidateResumeSection
                    candidate={candidate}
                    isUploadingResume={false}
                    onResumeUpload={() => {}}
                    onPreviewClick={() => {}}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Page: Review Form */}
          <div className="w-full md:w-[400px] bg-background border-t md:border-t-0 md:border-l flex flex-col shrink-0 z-10 shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.05)]">
            <div className="px-6 py-4 border-b shrink-0">
              <h3 className="font-semibold">
                {t("candidate.review", "Review Assessment")}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
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
      </DialogContent>
    </Dialog>
  );
}
