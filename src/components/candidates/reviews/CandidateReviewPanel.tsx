import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useAddCandidateComment,
  useCandidateComments,
} from "@/hooks/queries/useCandidateComments";
import { CANDIDATES_QUERY_KEY } from "@/hooks/queries/useCandidates";
import { CandidatesAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/candidate";
import { CommentInput } from "../comments/CommentInput";
import { CommentList } from "../comments/CommentList";

interface CandidateReviewPanelProps {
  candidate: Candidate;
  onReviewSubmit?: () => void;
}

export const CandidateReviewPanel: React.FC<CandidateReviewPanelProps> = ({
  candidate,
  onReviewSubmit,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: comments = [], isLoading } = useCandidateComments(candidate.id);
  const { mutateAsync: addComment } = useAddCandidateComment();
  const [isReviewing, setIsReviewing] = useState(false);

  const handleAddComment = async (content: string) => {
    await addComment({ candidateId: candidate.id, content });
  };

  const handleReview = async (status: "suitable" | "unsuitable") => {
    setIsReviewing(true);
    try {
      // We pass empty string for reviewNote as it's no longer collected separately
      await CandidatesAPI.review(candidate.id, status);
      toast.success(
        t("candidate.reviewSuccess", "Review submitted successfully"),
      );

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["pending-resumes"] });
      queryClient.invalidateQueries({ queryKey: CANDIDATES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CANDIDATES_QUERY_KEY, "reviewed"],
      });
      queryClient.invalidateQueries({
        queryKey: [...CANDIDATES_QUERY_KEY, candidate.id, "history"],
      });

      if (onReviewSubmit) {
        onReviewSubmit();
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(t("candidate.reviewFailed", "Failed to submit review"));
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* Header with Review Actions */}
      <div className="p-4 border-b bg-muted/5 space-y-4 shrink-0">
        <div>
          <h3 className="font-semibold text-sm mb-1">
            {t("candidate.reviewActions", "Review Decision")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("candidate.reviewActionsDesc", "Mark current candidate as:")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className={cn(
              "justify-start",
              "border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600",
              "dark:border-red-900/50 dark:hover:bg-red-950/50 dark:text-red-400",
            )}
            onClick={() => handleReview("unsuitable")}
            disabled={isReviewing}
          >
            <X className="mr-2 h-4 w-4" />
            {t("candidate.unsuitable", "Unsuitable")}
          </Button>
          <Button
            variant="outline"
            className={cn(
              "justify-start",
              "border-green-200 hover:bg-green-50 hover:text-green-700 text-green-600",
              "dark:border-green-900/50 dark:hover:bg-green-950/50 dark:text-green-400",
            )}
            onClick={() => handleReview("suitable")}
            disabled={isReviewing}
          >
            <Check className="mr-2 h-4 w-4" />
            {t("candidate.suitable", "Suitable")}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-background border-t">
        {/* Comments Header */}
        <div className="px-4 py-3 border-b bg-muted/30 shrink-0 flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            {t("recruitment.candidates.comments.title", "Comments")}
            {comments.length > 0 && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {comments.length}
              </span>
            )}
          </h3>
        </div>

        {/* Comment List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="relative py-2 px-4">
            {(comments.length > 0 || isLoading) && (
              <div className="absolute left-[36px] top-2 bottom-2 w-[1px] bg-border -z-10" />
            )}
            {isLoading && comments.length === 0 ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <CommentList comments={comments} isLoading={isLoading} />
            )}
          </div>
        </ScrollArea>

        {/* Comment Input */}
        <div className="p-4 border-t bg-muted/5 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] shrink-0 z-10">
          <CommentInput onSubmit={handleAddComment} />
        </div>
      </div>
    </div>
  );
};
