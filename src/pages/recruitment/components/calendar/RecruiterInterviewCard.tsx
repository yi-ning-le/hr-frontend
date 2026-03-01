import { format } from "date-fns";
import { Briefcase, Clock, Edit, FileText, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { EditInterviewDialog } from "@/components/interviews/EditInterviewDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteInterview } from "@/hooks/queries/useInterviews";
import { useResolveCandidateStatus } from "@/hooks/useCandidateStatuses";
import type { Candidate } from "@/types/candidate";
import type { Interview } from "@/types/recruitment.d";

interface RecruiterInterviewCardProps {
  interview: Interview;
  candidate?: Candidate;
  onPreviewResume: (candidate: Candidate) => void;
}

export function RecruiterInterviewCard({
  interview,
  candidate,
  onPreviewResume,
}: RecruiterInterviewCardProps) {
  const { t } = useTranslation();
  const { resolveStatus } = useResolveCandidateStatus();
  const statusDef = resolveStatus(interview, candidate);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutateAsync: deleteInterview, isPending: isDeleting } =
    useDeleteInterview();

  const handleDelete = async () => {
    try {
      await deleteInterview(interview.id);
      setIsDeleteOpen(false);
      toast.success(
        t(
          "recruitment.interviews.deleteSuccess",
          "Interview deleted successfully",
        ),
      );
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(
        err.response?.data?.error ||
          t(
            "recruitment.interviews.deleteFailed",
            "Failed to delete interview",
          ),
      );
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1.5 min-w-0">
              <CardTitle className="flex items-center gap-2 text-lg truncate">
                <span className="truncate" title={candidate?.name}>
                  {candidate?.name ||
                    t(
                      "recruitment.candidates.unknownCandidate",
                      "Unknown Candidate",
                    )}
                </span>
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 flex-wrap">
                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                <span
                  className="truncate max-w-[150px]"
                  title={candidate?.appliedJobTitle}
                >
                  {candidate?.appliedJobTitle ||
                    t(
                      "recruitment.candidates.unknownPosition",
                      "Unknown Position",
                    )}
                </span>
                {statusDef && (
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: statusDef.color,
                      color: statusDef.color,
                    }}
                    className="h-5 text-[10px] px-1.5 ml-1"
                  >
                    {statusDef.name}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-1">
              {interview.status === "PENDING" && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t(
                    "recruitment.interviews.deleteInterview",
                    "Delete Interview",
                  )}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label={t(
                  "recruitment.interviews.editInterview",
                  "Edit Interview",
                )}
                className="h-8 w-8 -mr-2"
                onClick={() => setIsEditOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
            <div className="flex flex-col items-center justify-center bg-background border rounded-md min-w-14 h-14 shadow-sm">
              <span className="text-xs text-muted-foreground uppercase font-medium">
                {format(new Date(interview.scheduledTime), "MMM")}
              </span>
              <span className="text-lg font-bold leading-none">
                {format(new Date(interview.scheduledTime), "d")}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {(() => {
                  const start = new Date(interview.scheduledTime);
                  const end = interview.scheduledEndTime
                    ? new Date(interview.scheduledEndTime)
                    : null;
                  if (end) {
                    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
                  }
                  return format(start, "h:mm a");
                })()}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(interview.scheduledTime), "EEEE")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {t("recruitment.interviews.interviewer")}:{" "}
              <span className="font-medium text-foreground">
                {interview.interviewerName || t("common.unknown")}
              </span>
            </span>
          </div>
        </CardContent>
        <CardFooter className="pt-0 gap-2">
          {candidate?.resumeUrl && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => onPreviewResume(candidate)}
            >
              <FileText className="h-4 w-4" />
              {t("recruitment.candidates.detail.viewResume", "View Resume")}
            </Button>
          )}
        </CardFooter>
      </Card>

      <EditInterviewDialog
        interview={interview}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("recruitment.interviews.deleteInterview", "Delete Interview")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "recruitment.interviews.deleteConfirm",
                "Are you sure you want to delete this interview? This action cannot be undone.",
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? t("common.deleting", "Deleting...")
                : t("common.delete", "Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
