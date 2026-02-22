import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { CandidateInfoSection } from "@/pages/recruitment/components/candidates/detail/CandidateInfoSection";
import type { Candidate } from "@/types/candidate";

interface CandidateInfoDialogProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenResume?: () => void;
}

export function CandidateInfoDialog({
  candidate,
  open,
  onOpenChange,
}: CandidateInfoDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden shadow-2xl border-0 rounded-xl bg-card">
        <div className="bg-muted/20 p-6 flex flex-col items-center border-b text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 ring-4 ring-background shadow-sm">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold">
            {candidate.name}
          </DialogTitle>
          <VisuallyHidden.Root asChild>
            <DialogDescription>
              {t(
                "candidate.infoDesc",
                "Candidate information for {{name}} - {{jobTitle}}",
                {
                  name: candidate.name,
                  jobTitle: candidate.appliedJobTitle,
                },
              )}
            </DialogDescription>
          </VisuallyHidden.Root>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            {candidate.appliedJobTitle}
          </p>
        </div>

        <div className="p-6">
          <CandidateInfoSection candidate={candidate} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
