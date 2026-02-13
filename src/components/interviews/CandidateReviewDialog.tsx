import { useEffect, useState } from "react";
import type { Candidate } from "@/types/candidate";
import { CandidateInfoDialog } from "./CandidateInfoDialog";
import { CandidateResumeViewerDialog } from "./CandidateResumeViewerDialog";

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
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsInfoOpen(false);
    }
  }, [open]);

  return (
    <>
      <CandidateResumeViewerDialog
        candidate={candidate}
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsInfoOpen(false);
            onOpenChange(false);
          }
        }}
        onReviewSubmit={() => onOpenChange(false)}
        onOpenInfo={() => setIsInfoOpen(true)}
      />
      <CandidateInfoDialog
        candidate={candidate}
        open={open && isInfoOpen}
        onOpenChange={setIsInfoOpen}
      />
    </>
  );
}
