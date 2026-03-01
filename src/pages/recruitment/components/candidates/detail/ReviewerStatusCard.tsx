import { RotateCcw, User, UserX } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRevertReviewer } from "@/hooks/queries/useCandidates";
import type { Candidate } from "@/types/candidate";

interface ReviewerStatusCardProps {
  candidate: Candidate;
  onUpdate: () => void;
}

const REVIEW_STATUS_CONFIG = {
  pending: { key: "candidate.reviewStatusOptions.pending", default: "Pending" },
  suitable: {
    key: "candidate.reviewStatusOptions.suitable",
    default: "Suitable",
  },
  unsuitable: {
    key: "candidate.reviewStatusOptions.unsuitable",
    default: "Unsuitable",
  },
} as const;

function getInitials(name?: string) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getErrorMessage(error: unknown, defaultMessage: string) {
  const err = error as { response?: { data?: { error?: string } } };
  return err.response?.data?.error || defaultMessage;
}

export function ReviewerStatusCard({
  candidate,
  onUpdate,
}: ReviewerStatusCardProps) {
  const { t } = useTranslation();
  const [isRevertOpen, setIsRevertOpen] = useState(false);
  const { mutateAsync: revertReviewer, isPending: isReverting } =
    useRevertReviewer();

  if (candidate.reviewStatus !== "pending") {
    return null;
  }

  const hasReviewer = !!candidate.reviewerId;
  const canRevert = hasReviewer;

  const handleRevert = async () => {
    try {
      await revertReviewer(candidate.id);
      setIsRevertOpen(false);
      onUpdate();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          t("candidate.revertReviewerFailed", "Failed to revert reviewer"),
        ),
      );
    }
  };

  const statusInfo = candidate.reviewStatus
    ? REVIEW_STATUS_CONFIG[
        candidate.reviewStatus as keyof typeof REVIEW_STATUS_CONFIG
      ]
    : null;
  const initials = getInitials(candidate.reviewerName);

  return (
    <>
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-muted/50 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2 text-balance">
            <User className="h-4 w-4 text-primary/60" />
            {t("candidate.reviewer", "Reviewer")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 min-w-0">
          {!hasReviewer ? (
            <div className="flex items-center gap-2 text-muted-foreground/70 text-sm py-1">
              <UserX className="h-4 w-4 shrink-0" />
              {t("candidate.noReviewer", "No reviewer assigned")}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 shrink-0 border border-muted/50 shadow-inner">
                  <AvatarFallback className="text-xs bg-muted/80 text-muted-foreground font-medium">
                    {initials || <User className="h-5 w-5 opacity-50" />}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm min-w-0 flex-1 flex flex-col justify-center">
                  <div className="font-semibold truncate text-foreground/90">
                    {candidate.reviewerName || candidate.reviewerId}
                  </div>
                  {statusInfo && (
                    <div className="text-muted-foreground/70 text-xs flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shrink-0" />
                      <span className="truncate">
                        {t(statusInfo.key, statusInfo.default)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {canRevert && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-destructive/80 hover:text-destructive hover:bg-destructive/5 focus-visible:ring-destructive shrink-0 h-8 px-2.5 transition-colors"
                  onClick={() => setIsRevertOpen(true)}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">
                    {t("common.revert", "Revert")}
                  </span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isRevertOpen} onOpenChange={setIsRevertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("candidate.revertReviewer", "Revert Reviewer Assignment")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "candidate.revertReviewerConfirm",
                "Are you sure you want to remove this reviewer? This action cannot be undone.",
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRevertOpen(false)}
              disabled={isReverting}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevert}
              disabled={isReverting}
            >
              {isReverting
                ? t("common.reverting", "Reverting...")
                : t("common.revert", "Revert")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
