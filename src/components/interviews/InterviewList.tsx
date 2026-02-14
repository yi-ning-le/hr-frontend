import { Calendar } from "lucide-react";
import type { Candidate } from "@/types/candidate";
import type { Interview } from "@/types/recruitment.d";
import { InterviewCard } from "./InterviewCard";

interface InterviewListProps {
  interviews: Interview[];
  candidatesById: Map<string, Candidate>;
  onPreviewResume: (candidate: Candidate) => void;
  emptyTitle: string;
  emptyDesc: string;
}

export function InterviewList({
  interviews,
  candidatesById,
  onPreviewResume,
  emptyTitle,
  emptyDesc,
}: InterviewListProps) {
  if (interviews.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground">{emptyTitle}</h3>
        <p className="text-muted-foreground mt-1">{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {interviews.map((interview) => {
        const candidate = candidatesById.get(interview.candidateId);
        return (
          <InterviewCard
            key={interview.id}
            interview={interview}
            candidate={candidate}
            onPreviewResume={onPreviewResume}
          />
        );
      })}
    </div>
  );
}
