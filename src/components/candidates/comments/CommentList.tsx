import { MessageSquare } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import type { CandidateComment } from "@/types/candidate";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: CandidateComment[];
  isLoading?: boolean;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  isLoading,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 py-4">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-sm">{t("recruitment.candidates.comments.empty")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
