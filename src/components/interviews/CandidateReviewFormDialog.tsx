import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useTranslation } from "react-i18next";
import { CandidateReviewPanel } from "@/components/candidates/reviews/CandidateReviewPanel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Candidate } from "@/types/candidate";

interface CandidateReviewFormDialogProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CandidateReviewFormDialog({
  candidate,
  open,
  onOpenChange,
  onSuccess,
}: CandidateReviewFormDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        side="right"
        className="max-w-md w-full h-full max-h-none rounded-none border-l flex flex-col p-0 overflow-hidden sm:max-w-lg"
      >
        <DialogHeader className="p-4 border-b shrink-0 bg-muted/10">
          <DialogTitle>
            {t("candidate.reviewTitle", "Review Candidate")}: {candidate.name}
          </DialogTitle>
          <VisuallyHidden.Root asChild>
            <DialogDescription>
              {t(
                "candidate.reviewDesc",
                "Review and assess candidate qualifications",
              )}
            </DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <CandidateReviewPanel
            candidate={candidate}
            onReviewSubmit={() => {
              onSuccess?.();
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
