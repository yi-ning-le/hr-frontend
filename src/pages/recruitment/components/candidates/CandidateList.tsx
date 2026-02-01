import { Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CandidateCard } from "./CandidateCard";
import type { Candidate } from "@/types/candidate";

interface CandidateListProps {
  candidates: Candidate[];
  onCandidateClick: (candidate: Candidate) => void;
}

export function CandidateList({
  candidates,
  onCandidateClick,
}: CandidateListProps) {
  return (
    <div className="flex-1 bg-slate-50/30 dark:bg-slate-900/10 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onClick={() => onCandidateClick(candidate)}
            />
          ))}
          {candidates.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Users className="h-12 w-12 mb-4 opacity-20" />
              <p>未找到符合条件的候选人</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
