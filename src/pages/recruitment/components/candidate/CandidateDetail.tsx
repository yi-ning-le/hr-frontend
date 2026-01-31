import { useState } from "react";
import { format } from "date-fns";
import {
  Users,
  Mail,
  Phone,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
  UploadCloud,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CandidateStatus } from "@/types/candidate"; // Type only, data from store
import { useCandidateStore } from "@/stores/useCandidateStore";
import { ResumePreviewModal } from "./ResumePreviewModal";
import { PdfPreview } from "./PdfPreview";
import { CandidateForm, type CandidateFormValues } from "./CandidateForm";
import { toast } from "sonner";

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

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);

    // Simulate upload delay
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
      <DialogHeader className="p-6 pb-4 border-b shrink-0 bg-background z-10">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-lg">
                {candidate.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <DialogTitle className="text-2xl">{candidate.name}</DialogTitle>
              <DialogDescription>
                申请职位：
                <span className="font-medium text-foreground">
                  {candidate.appliedJobTitle}
                </span>
              </DialogDescription>
              <div className="flex gap-2">
                <Badge variant="secondary">{candidate.channel}</Badge>
                <Badge variant="outline">
                  {candidate.experienceYears}年经验
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={candidate.status}
              onValueChange={(v) => updateCandidateStatus(candidate.id, v as CandidateStatus)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">新投递</SelectItem>
                <SelectItem value="screening">筛选中</SelectItem>
                <SelectItem value="interview">面试中</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">已入职</SelectItem>
                <SelectItem value="rejected">已淘汰</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteAlert(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 min-h-0 w-full">
        <div className="p-6 pb-20 grid gap-8">
          {/* Basic Info */}
          <section>
            <h4 className="mb-4 text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" /> 基本信息
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">邮箱</label>
                <div className="flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {candidate.email}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">电话</label>
                <div className="flex items-center gap-2 font-medium">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {candidate.phone}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">教育背景</label>
                <div className="font-medium">{candidate.education}</div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">申请时间</label>
                <div className="font-medium">
                  {format(candidate.appliedAt, "yyyy-MM-dd HH:mm")}
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Resume Preview */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> 简历预览
              </h4>
              <div className="flex gap-2">
                {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => window.open(candidate.resumeUrl, "_blank")}
                  >
                    下载简历
                  </Button>
                ) : null}
              </div>
            </div>
            {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
              <div
                onClick={() => setIsPreviewOpen(true)}
                className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all rounded-xl"
              >
                <PdfPreview
                  url={candidate.resumeUrl}
                  maxHeight="300px"
                  showToolbar={false}
                  initialScale={0.8}
                />
              </div>
            ) : (
              <div className="rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 p-8 text-center text-sm text-muted-foreground min-h-[200px] flex flex-col items-center justify-center border-dashed relative hover:bg-muted/50 transition-colors">
                {isUploadingResume ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Uploading resume...</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-10 w-10 mb-3 opacity-20" />
                    <p className="font-medium mb-1">暂无简历文件</p>
                    <p className="text-xs text-muted-foreground mb-4">Click to upload or drag and drop</p>
                    <Button variant="outline" size="sm" className="relative">
                      Upload Resume
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleResumeUpload}
                      />
                    </Button>
                  </>
                )}
              </div>
            )}
          </section>

          <Separator />

          {/* Notes */}
          <section className="space-y-4 pb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> 面试官备注
              </h4>
              {!isEditingNote && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsEditingNote(true)}>
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </div>

            {isEditingNote ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="添加候选人备注..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-[120px] resize-none focus-visible:ring-primary"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleNoteCancel}>
                    <X className="mr-1 h-3 w-3" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleNoteSave}>
                    <Check className="mr-1 h-3 w-3" /> Save
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="text-sm text-foreground/80 bg-muted/30 p-4 rounded-lg min-h-[60px] whitespace-pre-wrap cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsEditingNote(true)}
              >
                {candidate.note || <span className="text-muted-foreground italic">No notes added yet. Click to add...</span>}
              </div>
            )}
          </section>
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

