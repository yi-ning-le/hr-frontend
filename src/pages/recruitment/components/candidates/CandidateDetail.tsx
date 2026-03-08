import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CandidateResumeSection } from "@/components/candidates/CandidateResumeSection";
import { ResumePreviewModal } from "@/components/candidates/ResumePreviewModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useCandidates,
  useDeleteCandidate,
  useUpdateCandidate,
  useUpdateCandidateResume,
  useUpdateCandidateStatus,
} from "@/hooks/queries/useCandidates";
import type { Candidate } from "@/types/candidate";
import { CandidateForm, type CandidateFormValues } from "./CandidateForm";
import { CandidateDetailHeader } from "./detail/CandidateDetailHeader";
import { CandidateInfoSection } from "./detail/CandidateInfoSection";
import { ReviewerStatusCard } from "./detail/ReviewerStatusCard";

interface CandidateDetailProps {
  candidateId: string;
  showResume?: boolean;
  onShowResumeChange?: (show: boolean) => void;
  onClose: () => void;
}

export function CandidateDetail({
  candidateId,
  showResume = false,
  onShowResumeChange,
  onClose,
}: CandidateDetailProps) {
  const { t } = useTranslation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(showResume);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Synchronize state with prop for deep linking
  useEffect(() => {
    setIsPreviewOpen(showResume);
  }, [showResume]);

  const handlePreviewOpenChange = (open: boolean) => {
    setIsPreviewOpen(open);
    onShowResumeChange?.(open);
  };

  // Use TanStack Query
  const { data: candidateData, refetch } = useCandidates();
  const candidates = candidateData?.data || [];
  const { mutate: updateCandidateStatus } = useUpdateCandidateStatus();
  const { mutate: updateCandidate } = useUpdateCandidate();
  const { mutate: updateResume, isPending: isResumeUpdating } =
    useUpdateCandidateResume();
  const { mutate: deleteCandidate } = useDeleteCandidate();

  const candidate = candidates.find((c: Candidate) => c.id === candidateId);

  if (!candidate) return null;

  const handleEditSubmit = (values: CandidateFormValues) => {
    updateCandidate({ id: candidate.id, updates: values });
    setIsEditing(false);
    toast.success(t("recruitment.candidates.dialog.updateSuccess"));
  };

  const handleDelete = () => {
    deleteCandidate(candidate.id);
    onClose(); // Close the detail view
    toast.success(t("recruitment.candidates.dialog.deleteSuccess"));
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>
            {t("recruitment.candidates.dialog.editTitle")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-6">
          <CandidateForm
            defaultValues={candidate}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <CandidateDetailHeader
        candidate={candidate}
        onStatusChange={(status) =>
          updateCandidateStatus({ id: candidate.id, status })
        }
        onEdit={() => setIsEditing(true)}
        onDelete={() => setShowDeleteAlert(true)}
      />

      <ScrollArea className="flex-1 min-h-0 w-full">
        <div className="p-6 pb-20 grid gap-8">
          <div className="flex flex-col gap-6">
            <CandidateInfoSection candidate={candidate} />
            <ReviewerStatusCard
              candidate={candidate}
              onUpdate={() => refetch()}
            />
          </div>

          <Separator />

          <CandidateResumeSection
            candidate={candidate}
            onPreviewClick={() => handlePreviewOpenChange(true)}
            isResumeUpdating={isResumeUpdating}
            onResumeUpdate={(file) => {
              const lowerName = file.name.toLowerCase();
              const lowerType = file.type.toLowerCase();
              const hasPdfExtension = lowerName.endsWith(".pdf");
              const hasPdfMime = lowerType.includes("pdf");
              if (!hasPdfExtension && lowerType !== "" && !hasPdfMime) {
                toast.error(t("recruitment.candidates.dialog.uploadError"));
                return;
              }

              updateResume(
                { id: candidate.id, file },
                {
                  onSuccess: () =>
                    toast.success(
                      t("recruitment.candidates.detail.resumeUpdateSuccess"),
                    ),
                  onError: () =>
                    toast.error(
                      t("recruitment.candidates.detail.resumeUpdateError"),
                    ),
                },
              );
            }}
          />

          <Separator />

          {/* <CandidateActivityTimeline candidateId={candidate.id} scope="all" /> */}
        </div>
      </ScrollArea>

      {/* Resume Preview Modal */}
      <ResumePreviewModal
        candidate={candidate}
        open={isPreviewOpen}
        onOpenChange={handlePreviewOpenChange}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("recruitment.candidates.dialog.deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("recruitment.candidates.dialog.deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive active:bg-destructive/80 transition-colors"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
