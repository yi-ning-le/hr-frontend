import { format } from "date-fns";
import { Briefcase, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Candidate } from "@/types/candidate";
import { StatusBadge } from "./StatusBadge";

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const { t } = useTranslation();

  return (
    <button
      className="group relative flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-left w-full"
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback>
              {candidate.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium leading-none group-hover:text-primary transition-colors">
              {candidate.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {candidate.appliedJobTitle}
            </div>
          </div>
        </div>
        <StatusBadge status={candidate.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-1 w-full">
        <div className="flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          {t("recruitment.candidates.card.yearsExp", {
            years: candidate.experienceYears,
          })}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {t("recruitment.candidates.card.appliedOn", {
            date: format(
              candidate.appliedJobId ? candidate.appliedAt : new Date(),
              "MM-dd",
            ),
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 pt-3 border-t w-full">
        <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          {candidate.channel}
        </span>
      </div>
    </button>
  );
}
