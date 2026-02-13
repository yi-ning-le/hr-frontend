import type React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useAddCandidateComment,
  useCandidateComments,
} from "@/hooks/queries/useCandidateComments";
import { cn } from "@/lib/utils";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

interface CandidateCommentsSectionProps {
  candidateId: string;
  className?: string;
  header?: React.ReactNode;
  maxHeight?: string | number;
}

export const CandidateCommentsSection: React.FC<
  CandidateCommentsSectionProps
> = ({ candidateId, className, header, maxHeight }) => {
  const { data: comments = [], isLoading } = useCandidateComments(candidateId);
  const { mutateAsync: addComment } = useAddCandidateComment();

  const handleAddComment = async (content: string) => {
    await addComment({ candidateId, content });
  };

  return (
    <div className={cn("flex flex-col bg-background", className)}>
      {header}
      <ScrollArea
        className="flex-1 min-h-0"
        style={maxHeight ? { maxHeight } : undefined}
      >
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
