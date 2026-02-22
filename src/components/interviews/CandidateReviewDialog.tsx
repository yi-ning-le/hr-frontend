import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AlertCircle, FileText, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PdfPreview } from "@/components/candidates/PdfPreview";
import { CandidateReviewPanel } from "@/components/candidates/reviews/CandidateReviewPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Candidate } from "@/types/candidate";

interface CandidateReviewDialogProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateReviewDialog({
  candidate,
  open,
  onOpenChange,
}: CandidateReviewDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] h-[95vh] max-w-none sm:max-w-none p-0 gap-0 overflow-hidden flex flex-col lg:flex-row"
      >
        <VisuallyHidden.Root>
          <DialogTitle>
            {t("candidate.reviewTitle", "Review Candidate")}: {candidate.name}
          </DialogTitle>
          <DialogDescription>
            {t(
              "candidate.reviewDesc",
              "Review candidate resume and submit assessment",
            )}
          </DialogDescription>
        </VisuallyHidden.Root>

        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-background/90 hover:bg-background"
            aria-label={t("common.close", "Close")}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>

        {/* Left Panel: Resume Viewer */}
        <div className="flex-1 flex flex-col min-w-0 lg:min-w-[560px] bg-muted/10 border-b lg:border-b-0 lg:border-r">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b shrink-0 bg-background/50 backdrop-blur-sm">
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

          {/* Content */}
          <div className="flex-1 min-h-0 relative flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
            {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
              <PdfPreview
                pdfUrl={candidate.resumeUrl}
                className="flex-1 w-full h-full bg-transparent border-0"
                showToolbar={true}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md space-y-6">
                  <Alert variant="destructive" className="bg-destructive/5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>
                      {t("candidate.noResumeTitle", "No Resume Available")}
                    </AlertTitle>
                    <AlertDescription>
                      {t(
                        "candidate.noResumeDesc",
                        "This candidate does not have a resume uploaded yet.",
                      )}
                    </AlertDescription>
                  </Alert>

                  <div className="bg-background rounded-lg border p-6 shadow-sm">
                    <h4 className="text-sm font-medium mb-2">
                      {t("candidate.noResumeInReview", "Resume not uploaded")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        "candidate.noResumeInReviewDesc",
                        "Please ask recruiter to upload the resume from candidate management.",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Review Form */}
        <div className="w-full h-[42%] lg:h-auto lg:basis-[36%] lg:min-w-[320px] lg:max-w-[420px] shrink-0 bg-background border-t lg:border-t-0 flex flex-col z-10 shadow-xl">
          <div className="h-full overflow-hidden">
            <CandidateReviewPanel
              candidate={candidate}
              onReviewSubmit={() => onOpenChange(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
