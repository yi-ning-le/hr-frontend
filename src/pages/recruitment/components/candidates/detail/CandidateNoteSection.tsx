import { FileText, Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Candidate } from "@/types/candidate";

interface CandidateNoteSectionProps {
  candidate: Candidate;
  isEditingNote: boolean;
  noteContent: string;
  onNoteChange: (content: string) => void;
  onNoteSave: () => void;
  onNoteCancel: () => void;
  onEditClick: () => void;
}

export function CandidateNoteSection({
  candidate,
  isEditingNote,
  noteContent,
  onNoteChange,
  onNoteSave,
  onNoteCancel,
  onEditClick,
}: CandidateNoteSectionProps) {
  return (
    <section className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <FileText className="h-4 w-4" /> 面试官备注
        </h4>
        {!isEditingNote && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onEditClick}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isEditingNote ? (
        <div className="space-y-2">
          <Textarea
            placeholder="添加候选人备注..."
            value={noteContent}
            onChange={(e) => onNoteChange(e.target.value)}
            className="min-h-[120px] resize-none focus-visible:ring-primary"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onNoteCancel}>
              <X className="mr-1 h-3 w-3" /> Cancel
            </Button>
            <Button size="sm" onClick={onNoteSave}>
              <Check className="mr-1 h-3 w-3" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="text-sm text-foreground/80 bg-muted/30 p-4 rounded-lg min-h-[60px] whitespace-pre-wrap cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={onEditClick}
        >
          {candidate.note || (
            <span className="text-muted-foreground italic">
              No notes added yet. Click to add...
            </span>
          )}
        </div>
      )}
    </section>
  );
}
