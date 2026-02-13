import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
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
import { CandidatesAPI } from "@/lib/api";
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
      await CandidatesAPI.review(candidate.id, status, "");
      toast.success(
        t("candidate.reviewSuccess", "Review submitted successfully"),
      );

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["pending-resumes"] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });

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
            className="border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600 justify-start"
            onClick={() => handleReview("unsuitable")}
            disabled={isReviewing}
          >
            <X className="mr-2 h-4 w-4" />
            {t("candidate.unsuitable", "Unsuitable")}
          </Button>
          <Button
            variant="outline"
            className="border-green-200 hover:bg-green-50 hover:text-green-700 text-green-600 justify-start"
            onClick={() => handleReview("suitable")}
            disabled={isReviewing}
          >
            <Check className="mr-2 h-4 w-4" />
            {t("candidate.suitable", "Suitable")}
          </Button>
        </div>
      </div>

      {/* Title for Comments */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
        <h3 className="font-semibold text-sm">
          {t("recruitment.candidates.comments.title", "Comments")}
        </h3>
        {comments.length > 0 && (
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground font-medium">
            {comments.length}
          </span>
        )}
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="relative py-2 px-4">
          {(comments.length > 0 || isLoading) && (
            <div className="absolute left-[36px] top-2 bottom-2 w-[1px] bg-border -z-10" />
          )}
          <CommentList comments={comments} isLoading={isLoading} />
        </div>
      </ScrollArea>

      {/* Comment Input */}
      <div className="p-4 border-t bg-muted/5 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] shrink-0 z-10">
        <CommentInput onSubmit={handleAddComment} />
      </div>
    </div>
  );
};
