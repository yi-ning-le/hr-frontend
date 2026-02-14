import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Briefcase, Calendar, Clock, FileText, LayoutList } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResumePreviewModal } from "@/components/candidates/ResumePreviewModal";
import { InterviewCalendar } from "@/components/interviews/InterviewCalendar";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCandidates } from "@/hooks/queries/useCandidates";
import { useMyInterviews } from "@/hooks/queries/useInterviews";
import { useResolveCandidateStatus } from "@/hooks/useCandidateStatuses";
import { Route } from "@/routes/_protected/my-interviews";
import type { Candidate } from "@/types/candidate";
import type { Interview } from "@/types/recruitment.d";

export function MyInterviewsPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { viewMode } = Route.useSearch();
  const { data: interviews, isLoading: isLoadingInterviews } =
    useMyInterviews();
  const { data: candidateData, isLoading: isLoadingCandidates } =
    useCandidates();
  const { resolveStatus } = useResolveCandidateStatus();
  const candidates = candidateData?.data || [];
  const candidatesById = useMemo(
    () => new Map(candidates.map((candidate) => [candidate.id, candidate])),
    [candidates],
  );

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const setViewMode = (mode: "list" | "calendar") => {
    navigate({ search: (prev) => ({ ...prev, viewMode: mode }) });
  };

  const handlePreviewResume = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsPreviewOpen(true);
  };

  const upcomingInterviews = useMemo(() => {
    return (interviews || [])
      .filter((i) => i.status === "PENDING")
      .sort(
        (a, b) =>
          new Date(a.scheduledTime).getTime() -
          new Date(b.scheduledTime).getTime(),
      );
  }, [interviews]);

  const historyInterviews = useMemo(() => {
    return (interviews || [])
      .filter((i) => i.status !== "PENDING")
      .sort(
        (a, b) =>
          new Date(b.scheduledTime).getTime() -
          new Date(a.scheduledTime).getTime(),
      );
  }, [interviews]);

  if (isLoadingInterviews || isLoadingCandidates) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const renderInterviewList = (
    items: Interview[],
    emptyTitle: string,
    emptyDesc: string,
  ) => {
    if (items.length === 0) {
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
        {items.map((interview) => {
          const candidate = candidatesById.get(interview.candidateId);
          // Prefer snapshot status, fallback to current candidate status
          const statusDef = resolveStatus(interview, candidate);
          return (
            <Card
              key={interview.id}
              className="hover:shadow-md transition-shadow flex flex-col"
            >
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
                    onClick={() => handlePreviewResume(candidate)}
                    title={t(
                      "recruitment.candidates.detail.viewResume",
                      "View Resume",
                    )}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">
          {t("recruitment.interviews.myInterviews")}
        </h1>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="upcoming">
              {t("recruitment.interviews.tabs.upcoming")}
              {upcomingInterviews.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {upcomingInterviews.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">
              {t("recruitment.interviews.tabs.history")}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg self-start sm:self-auto">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2 h-8"
            >
              <LayoutList className="h-4 w-4" />
              {t("recruitment.interviews.listView")}
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="gap-2 h-8"
            >
              <Calendar className="h-4 w-4" />
              {t("recruitment.interviews.calendarView")}
            </Button>
          </div>
        </div>

        <TabsContent value="upcoming" className="space-y-4">
          {viewMode === "list" ? (
            renderInterviewList(
              upcomingInterviews,
              t(
                "recruitment.interviews.noUpcomingInterviews",
                "No Upcoming Interviews",
              ),
              t(
                "recruitment.interviews.noUpcomingInterviewsDesc",
                "You have no interviews scheduled for the future.",
              ),
            )
          ) : (
            <InterviewCalendar
              interviews={upcomingInterviews}
              candidates={candidatesById}
              onPreviewResume={handlePreviewResume}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {viewMode === "list" ? (
            renderInterviewList(
              historyInterviews,
              t(
                "recruitment.interviews.noHistoryInterviews",
                "No Past Interviews",
              ),
              t(
                "recruitment.interviews.noHistoryInterviewsDesc",
                "You haven't completed any interviews yet.",
              ),
            )
          ) : (
            <InterviewCalendar
              interviews={historyInterviews}
              candidates={candidatesById}
              onPreviewResume={handlePreviewResume}
            />
          )}
        </TabsContent>
      </Tabs>

      <ResumePreviewModal
        candidate={selectedCandidate}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
}
