import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Briefcase, Clock, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useResolveCandidateStatus } from "@/hooks/useCandidateStatuses";
import type { Candidate } from "@/types/candidate";
import type { Interview } from "@/types/recruitment.d";

interface InterviewCardProps {
  interview: Interview;
  candidate?: Candidate;
  onPreviewResume: (candidate: Candidate) => void;
}

export function InterviewCard({
  interview,
  candidate,
  onPreviewResume,
}: InterviewCardProps) {
  const { t } = useTranslation();
  const { resolveStatus } = useResolveCandidateStatus();
  const statusDef = resolveStatus(interview, candidate);

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 min-w-0">
            <CardTitle className="flex items-center gap-2 text-lg truncate">
              <span className="truncate" title={candidate?.name}>
                {candidate?.name ||
                  t(
                    "recruitment.candidates.unknownCandidate",
                    "Unknown Candidate",
                  )}
              </span>
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5 flex-wrap">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              <span
                className="truncate max-w-[150px]"
                title={candidate?.appliedJobTitle}
              >
                {candidate?.appliedJobTitle ||
                  t(
                    "recruitment.candidates.unknownPosition",
                    "Unknown Position",
                  )}
              </span>
              {statusDef && (
                <Badge
                  variant="outline"
                  style={{
                    borderColor: statusDef.color,
                    color: statusDef.color,
                  }}
                  className="h-5 text-[10px] px-1.5 ml-1"
                >
                  {statusDef.name}
                </Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
          <div className="flex flex-col items-center justify-center bg-background border rounded-md min-w-14 h-14 shadow-sm">
            <span className="text-xs text-muted-foreground uppercase font-medium">
              {format(new Date(interview.scheduledTime), "MMM")}
            </span>
            <span className="text-lg font-bold leading-none">
              {format(new Date(interview.scheduledTime), "d")}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-sm font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {(() => {
                const start = new Date(interview.scheduledTime);
                const end = interview.scheduledEndTime
                  ? new Date(interview.scheduledEndTime)
                  : null;
                if (end) {
                  return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
                }
                return format(start, "h:mm a");
              })()}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(interview.scheduledTime), "EEEE")}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        <Link
          to="/interviews/$interviewId"
          params={{ interviewId: interview.id }}
          className="flex-1"
        >
          <Button variant="outline" className="w-full">
            {t("recruitment.interviews.viewDetails")}
          </Button>
        </Link>
        {candidate?.resumeUrl && (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onPreviewResume(candidate)}
            title={t("recruitment.candidates.detail.viewResume", "View Resume")}
          >
            <FileText className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
