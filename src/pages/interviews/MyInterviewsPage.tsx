import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Briefcase, Calendar, Clock, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidates } from "@/hooks/queries/useCandidates";
import { useMyInterviews } from "@/hooks/queries/useInterviews";

export function MyInterviewsPage() {
  const { t } = useTranslation();
  const { data: interviews, isLoading: isLoadingInterviews } =
    useMyInterviews();
  const { data: candidateData, isLoading: isLoadingCandidates } =
    useCandidates();
  const candidates = candidateData?.data || [];

  if (isLoadingInterviews || isLoadingCandidates) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const getCandidateName = (candidateId: string) => {
    const candidate = candidates?.find((c) => c.id === candidateId);
    return candidate
      ? candidate.name
      : t("recruitment.candidates.unknownCandidate", "Unknown Candidate");
  };

  const getCandidate = (candidateId: string) => {
    return candidates?.find((c) => c.id === candidateId);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {t("recruitment.interviews.myInterviews")}
      </h1>

      {interviews?.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            {t("recruitment.interviews.noInterviews")}
          </h3>
          <p className="text-muted-foreground mt-1">
            {t("recruitment.interviews.noInterviewsDesc")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviews?.map((interview) => {
            const candidate = getCandidate(interview.candidateId);
            return (
              <Card
                key={interview.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant={
                        interview.status === "PENDING"
                          ? "default"
                          : interview.status === "COMPLETED"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {t(`recruitment.interviews.status.${interview.status}`)}
                    </Badge>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(
                        new Date(interview.scheduledTime),
                        "MMM d, h:mm a",
                      )}
                    </div>
                  </div>
                  <CardTitle className="mt-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {getCandidateName(interview.candidateId)}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {candidate?.appliedJobTitle ||
                      t(
                        "recruitment.candidates.unknownPosition",
                        "Unknown Position",
                      )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to="/interviews/$interviewId"
                    params={{ interviewId: interview.id }}
                  >
                    <Button className="w-full">
                      {t("recruitment.interviews.viewDetails")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
