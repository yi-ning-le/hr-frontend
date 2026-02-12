import { MessageSquare, X } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useAddCandidateComment,
  useCandidateComments,
} from "@/hooks/queries/useCandidateComments";
import type { Candidate } from "@/types/candidate";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

interface CandidateCommentSidebarProps {
  candidate: Candidate;
  onClose?: () => void;
}

export const CandidateCommentSidebar: React.FC<
  CandidateCommentSidebarProps
> = ({ candidate, onClose }) => {
  const { t } = useTranslation();

  const { data: comments = [], isLoading } = useCandidateComments(candidate.id);
  const { mutateAsync: addComment } = useAddCandidateComment();

  const handleAddComment = async (content: string) => {
    await addComment({ candidateId: candidate.id, content });
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-background overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between bg-muted/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">
            {t("recruitment.candidates.comments.title")}
          </h3>
          {comments.length > 0 && (
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground font-medium">
              {comments.length}
            </span>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 min-h-0" data-testid="comment-scroll-area">
        <div className="relative py-4 px-4">
          {(comments.length > 0 || isLoading) && (
            <div className="absolute left-[36px] top-4 bottom-4 w-[1px] bg-border -z-10" />
          )}
          <CommentList comments={comments} isLoading={isLoading} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/5 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] shrink-0 z-10">
        <CommentInput onSubmit={handleAddComment} />
      </div>
    </div>
  );
};
