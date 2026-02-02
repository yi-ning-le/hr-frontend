import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
// Type only, data from store
import { useCandidateStore } from "@/stores/useCandidateStore";
import { ResumePreviewModal } from "./ResumePreviewModal";
import { CandidateForm, type CandidateFormValues } from "./CandidateForm";
import { toast } from "sonner";
import { CandidateDetailHeader } from "./detail/CandidateDetailHeader";
import { CandidateInfoSection } from "./detail/CandidateInfoSection";
import { CandidateResumeSection } from "./detail/CandidateResumeSection";
import { CandidateNoteSection } from "./detail/CandidateNoteSection";

export function CandidateDetail() {
  const { t } = useTranslation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Note Editing State
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  // Resume Upload State
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  // Use store
  const selectedCandidateId = useCandidateStore((state) => state.selectedCandidateId);
  const candidates = useCandidateStore((state) => state.candidates);
  const updateCandidateStatus = useCandidateStore((state) => state.updateCandidateStatus);
  const updateCandidateNote = useCandidateStore((state) => state.updateCandidateNote);
  const updateCandidate = useCandidateStore((state) => state.updateCandidate);
  const removeCandidate = useCandidateStore((state) => state.removeCandidate);
  const selectCandidate = useCandidateStore((state) => state.selectCandidate);
  const uploadResume = useCandidateStore((state) => state.uploadResume);

  const candidate = candidates.find((c) => c.id === selectedCandidateId);

  if (!candidate) return null;

  // Initialize note content when candidate changes
  if (!isEditingNote && noteContent !== (candidate.note || "")) {
    setNoteContent(candidate.note || "");
  }

  const handleNoteSave = () => {
    updateCandidateNote(candidate.id, noteContent);
    setIsEditingNote(false);
    toast.success(t("recruitment.candidates.dialog.noteUpdated"));
  };

  const handleNoteCancel = () => {
    setNoteContent(candidate.note || "");
    setIsEditingNote(false);
  };

  const handleResumeUpload = async (file: File) => {
    // 1. Validate file format (PDF only)
    if (file.type !== "application/pdf") {
      toast.error(t("recruitment.candidates.dialog.resumeFormatError"));
      return;
    }

    setIsUploadingResume(true);

    try {
      await uploadResume(candidate.id, file);
      toast.success(t("recruitment.candidates.dialog.resumeUploadSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("recruitment.candidates.dialog.resumeUploadFailed"));
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleEditSubmit = (values: CandidateFormValues) => {
    updateCandidate(candidate.id, values);
    setIsEditing(false);
    toast.success(t("recruitment.candidates.dialog.updateSuccess"));
  };

  const handleDelete = () => {
    removeCandidate(candidate.id);
    selectCandidate(null); // Close the detail view
    toast.success(t("recruitment.candidates.dialog.deleteSuccess"));
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>{t("recruitment.candidates.dialog.editTitle")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-6">
          <CandidateForm
            defaultValues={candidate}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
            hideNote={true}
          />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <CandidateDetailHeader
        candidate={candidate}
        onStatusChange={(status) => updateCandidateStatus(candidate.id, status)}
        onEdit={() => setIsEditing(true)}
        onDelete={() => setShowDeleteAlert(true)}
      />

      <ScrollArea className="flex-1 min-h-0 w-full">
        <div className="p-6 pb-20 grid gap-8">
          <CandidateInfoSection candidate={candidate} />

          <Separator />

          <CandidateResumeSection
            candidate={candidate}
            isUploadingResume={isUploadingResume}
            onResumeUpload={handleResumeUpload}
            onPreviewClick={() => setIsPreviewOpen(true)}
          />

          <Separator />

          <CandidateNoteSection
            candidate={candidate}
            isEditingNote={isEditingNote}
            noteContent={noteContent}
            onNoteChange={setNoteContent}
            onNoteSave={handleNoteSave}
            onNoteCancel={handleNoteCancel}
            onEditClick={() => setIsEditingNote(true)}
          />
        </div>
      </ScrollArea>

      {/* Resume Preview Modal */}
      <ResumePreviewModal
        candidate={candidate}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("recruitment.candidates.dialog.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("recruitment.candidates.dialog.deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

