import { useState } from "react";
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

  const candidate = candidates.find((c) => c.id === selectedCandidateId);

  if (!candidate) return null;

  // Initialize note content when candidate changes
  if (!isEditingNote && noteContent !== (candidate.note || "")) {
    setNoteContent(candidate.note || "");
  }

  const handleNoteSave = () => {
    updateCandidateNote(candidate.id, noteContent);
    setIsEditingNote(false);
    toast.success("Note updated");
  };

  const handleNoteCancel = () => {
    setNoteContent(candidate.note || "");
    setIsEditingNote(false);
  };

  const handleResumeUpload = (file: File) => {
    // 1. Validate file format (PDF only)
    if (file.type !== "application/pdf") {
      toast.error("Format error: Only PDF files are supported for resume upload.");
      return;
    }

    setIsUploadingResume(true);

    // TODO: Integrate with backend API
    // 1. Upload file to server
    // 2. Get permanent URL from response
    // 3. Update candidate data via API call

    // Simulate upload delay for now
    setTimeout(() => {
      const resumeUrl = URL.createObjectURL(file);
      updateCandidate(candidate.id, { resumeUrl });
      setIsUploadingResume(false);
      toast.success("Resume uploaded successfully");
    }, 1500);
  };

  const handleEditSubmit = (values: CandidateFormValues) => {
    updateCandidate(candidate.id, values);
    setIsEditing(false);
    toast.success("Candidate updated successfully");
  };

  const handleDelete = () => {
    removeCandidate(candidate.id);
    selectCandidate(null); // Close the detail view
    toast.success("Candidate deleted");
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>Edit Candidate</DialogTitle>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the candidate
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

