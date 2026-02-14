import { Calendar, LayoutList } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResumePreviewModal } from "@/components/candidates/ResumePreviewModal";
import { InterviewCalendar } from "@/components/interviews/InterviewCalendar";
import { InterviewList } from "@/components/interviews/InterviewList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCandidates } from "@/hooks/queries/useCandidates";
import { useMyInterviews } from "@/hooks/queries/useInterviews";
import { Route } from "@/routes/_protected/my-interviews";
import type { Candidate } from "@/types/candidate";

export function MyInterviewsPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { viewMode } = Route.useSearch();
  const { data: interviews, isLoading: isLoadingInterviews } =
    useMyInterviews();
  const { data: candidateData, isLoading: isLoadingCandidates } =
    useCandidates();
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
            <InterviewList
              interviews={upcomingInterviews}
              candidatesById={candidatesById}
              onPreviewResume={handlePreviewResume}
              emptyTitle={t(
                "recruitment.interviews.noUpcomingInterviews",
                "No Upcoming Interviews",
              )}
              emptyDesc={t(
                "recruitment.interviews.noUpcomingInterviewsDesc",
                "You have no interviews scheduled for the future.",
              )}
            />
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
            <InterviewList
              interviews={historyInterviews}
              candidatesById={candidatesById}
              onPreviewResume={handlePreviewResume}
              emptyTitle={t(
                "recruitment.interviews.noHistoryInterviews",
                "No Past Interviews",
              )}
              emptyDesc={t(
                "recruitment.interviews.noHistoryInterviewsDesc",
                "You haven't completed any interviews yet.",
              )}
            />
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
