import { formatDistanceToNow } from "date-fns";
import { enUS, zhCN } from "date-fns/locale";
import { Check, X } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { CandidateComment } from "@/types/candidate";

interface CommentItemProps {
  comment: CandidateComment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "zh-CN" ? zhCN : enUS;

  const initials = comment.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isReviewComment =
    comment.commentType === "review_suitable" ||
    comment.commentType === "review_unsuitable";
  const isInterviewResult =
    comment.commentType === "interview_pass" ||
    comment.commentType === "interview_fail";
  const hasDecisionBadge = isReviewComment || isInterviewResult;
  const trimmedContent = comment.content.trim();
  // Only hide content if it's strictly a status marker without additional commentary
  const isStatusLiteral = /^(suitable|unsuitable|pass|fail)$/i.test(
    trimmedContent,
  );
  const showContent =
    trimmedContent !== "" && (!hasDecisionBadge || !isStatusLiteral);

  return (
    <div className="flex gap-3 py-4 border-b last:border-0 border-border/50 hover:bg-muted/30 transition-colors px-2 -mx-2 rounded-lg group">
      <Avatar className="h-10 w-10 flex-shrink-0 ring-1 ring-border">
        <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm truncate hover:underline cursor-pointer">
            {comment.authorName}
          </span>
          <Badge
            variant={comment.authorRole === "HR" ? "default" : "secondary"}
            className="text-[10px] px-1.5 py-0 h-4 leading-none font-medium"
          >
            {comment.authorRole === "HR"
              ? t("recruitment.candidates.comments.hrRole")
              : t("recruitment.candidates.comments.interviewerRole")}
          </Badge>
          <span className="text-xs text-muted-foreground">
            ·{" "}
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale,
            })}
          </span>
        </div>
        {isReviewComment && (
          <div
            data-testid="review-decision-badge"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold mb-2 ${
              comment.commentType === "review_suitable"
                ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
            }`}
          >
            {comment.commentType === "review_suitable" ? (
              <>
                <Check className="h-3.5 w-3.5" />
                {t("candidate.reviewCommentSuitable", "Suitable")}
              </>
            ) : (
              <>
                <X className="h-3.5 w-3.5" />
                {t("candidate.reviewCommentUnsuitable", "Unsuitable")}
              </>
            )}
          </div>
        )}
        {isInterviewResult && (
          <div
            data-testid="interview-result-badge"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold mb-2 ${
              comment.commentType === "interview_pass"
                ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
            }`}
          >
            {comment.commentType === "interview_pass" ? (
              <>
                <Check className="h-3.5 w-3.5" />
                {t("recruitment.interviews.resultPass", "Pass")}
              </>
            ) : (
              <>
                <X className="h-3.5 w-3.5" />
                {t("recruitment.interviews.resultFail", "Fail")}
              </>
            )}
          </div>
        )}
        {showContent && (
          <div className="text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
            {comment.content}
          </div>
        )}
      </div>
    </div>
  );
};
