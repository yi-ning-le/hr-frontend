import { Briefcase, Download, FileText, MessageSquare, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CandidateCommentSidebar } from "@/components/candidates/comments/CandidateCommentSidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCandidateComments } from "@/hooks/queries/useCandidateComments";
import { useJobs } from "@/hooks/queries/useJobs";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/candidate";
import type { JobPosition } from "@/types/job";
import { PdfPreview } from "./PdfPreview";

interface ResumePreviewModalProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumePreviewModal({
  candidate,
  open,
  onOpenChange,
}: ResumePreviewModalProps) {
  const { t } = useTranslation();
  const { data: jobs = [] } = useJobs();
  const [jdOpen, setJdOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const { data: comments = [] } = useCandidateComments(
    candidate?.id || "",
    open,
  );

  const job = useMemo(() => {
    if (!candidate) return null;
    return (
      jobs.find((j: JobPosition) => j.id === candidate.appliedJobId) || null
    );
  }, [candidate, jobs]);

  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-none w-auto h-[95vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center outline-none sm:max-w-none"
        showCloseButton={false}
      >
        <div className="flex gap-4 h-full pointer-events-none max-w-[98vw] overflow-hidden p-1">
          {/* Resume Card (Left) */}
          <div
            className={cn(
              "bg-background border rounded-lg shadow-lg flex flex-col pointer-events-auto transition-all duration-300 h-full",
              jdOpen && commentsOpen
                ? "w-[33vw]"
                : jdOpen || commentsOpen
                  ? "w-[45vw]"
                  : "w-[60vw] max-w-4xl",
            )}
          >
            <DialogHeader className="p-4 border-b flex-shrink-0 flex flex-row items-center justify-between space-y-0">
              <DialogDescription className="sr-only">
                {t("resumeModal.resumeOf", { name: candidate.name })}
              </DialogDescription>
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-left overflow-hidden">
                  <DialogTitle className="truncate">
                    {t("resumeModal.resumeOf", { name: candidate.name })}
                  </DialogTitle>
                  <div className="text-sm text-muted-foreground truncate">
                    {candidate.appliedJobTitle}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-4">
                {job && (
                  <Button
                    variant={jdOpen ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setJdOpen(!jdOpen)}
                    className="px-2 sm:px-3"
                  >
                    <Briefcase className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">
                      {jdOpen
                        ? t("resumeModal.hideJD")
                        : t("resumeModal.viewJD")}
                    </span>
                  </Button>
                )}
                <Button
                  variant={commentsOpen ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCommentsOpen(!commentsOpen)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t("recruitment.candidates.comments.title")}
                  {comments.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-primary text-primary-foreground rounded-full">
                      {comments.length}
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(candidate.resumeUrl, "_blank")}
                  className="hidden sm:flex"
                  aria-label={t("resumeModal.download")}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  aria-label={t("common.close")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 min-h-0 overflow-hidden p-4">
              {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
                <PdfPreview
                  pdfUrl={candidate.resumeUrl}
                  showToolbar={true}
                  initialScale={1.2}
                  maxHeight="calc(95vh - 8rem)"
                  className="h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-slate-100 dark:bg-slate-900 text-muted-foreground space-y-4 rounded-lg">
                  <FileText className="h-16 w-16 opacity-20" />
                  <p>{t("resumeModal.noResume")}</p>
                </div>
              )}
            </div>
          </div>

          {/* JD Card (Middle/Right) */}
          {jdOpen && job && (
            <div
              className={cn(
                "bg-background border rounded-lg shadow-lg flex flex-col pointer-events-auto h-full animate-in fade-in slide-in-from-left-4 duration-300",
                commentsOpen ? "w-[31vw]" : "w-[45vw]",
              )}
            >
              <div className="p-4 border-b flex-shrink-0 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg shrink-0">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-lg font-semibold leading-none tracking-tight truncate">
                      {t("resumeModal.jobDescription")}
                    </h2>
                    <div className="text-sm text-muted-foreground mt-1 truncate">
                      {job.title}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setJdOpen(false)}
                  aria-label={t("resumeModal.hideJD")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {job.jobDescription}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Comments Sidebar (Right) */}
          {commentsOpen && (
            <div
              className={cn(
                "bg-background border rounded-lg shadow-lg flex flex-col pointer-events-auto h-full animate-in fade-in slide-in-from-left-4 duration-300 overflow-hidden",
                jdOpen ? "w-[31vw]" : "w-[45vw]",
              )}
            >
              <CandidateCommentSidebar
                candidate={candidate}
                onClose={() => setCommentsOpen(false)}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
