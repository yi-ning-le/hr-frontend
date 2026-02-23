import { Send } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
  onContentChange?: (content: string) => void;
  className?: string;
  placeholder?: string;
  initialValue?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  onContentChange,
  className,
  placeholder,
  initialValue = "",
}) => {
  const { t } = useTranslation();
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("relative flex flex-col gap-2", className)}>
      <div className="relative group rounded-xl border border-muted-foreground/20 bg-background focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary/30 transition-all shadow-sm overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            onContentChange?.(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder || t("recruitment.candidates.comments.placeholder")
          }
          className="pr-10 min-h-[80px] max-h-[200px] py-3 resize-none border-none focus-visible:ring-0 shadow-none bg-transparent overflow-y-auto"
        />
      </div>
      <div className="flex justify-between items-center px-0.5">
        <span className="text-[10px] text-muted-foreground font-medium">
          {t("recruitment.candidates.comments.ctrlEnter")}
        </span>
        <Button
          size="sm"
          disabled={!content.trim() || isSubmitting}
          onClick={handleSubmit}
          className="h-8 px-3 transition-all active:scale-95"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t("recruitment.candidates.comments.saving")}
            </span>
          ) : (
            <>
              {t("recruitment.candidates.comments.submit")}
              <Send className="ml-2 h-3 w-3" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
