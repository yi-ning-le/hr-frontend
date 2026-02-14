import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { Calendar, LayoutList } from "lucide-react";
import { useMemo, useState } from "react";
import { type View, Views } from "react-big-calendar";
import { useTranslation } from "react-i18next";
import { ResumePreviewModal } from "@/components/candidates/ResumePreviewModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInterviews } from "@/hooks/queries/useInterviews";
import type { Candidate } from "@/types/candidate";
import type { Interview } from "@/types/recruitment.d";
import { RecruiterInterviewCalendar } from "./RecruiterInterviewCalendar";
import { RecruiterInterviewList } from "./RecruiterInterviewList";

// Helper to map interviews to candidates for UI
const getCandidatesMap = (interviews: Interview[]) => {
  const map = new Map<string, Candidate>();
  interviews.forEach((interview) => {
    if (!map.has(interview.candidateId)) {
      map.set(interview.candidateId, {
        id: interview.candidateId,
        name: interview.candidateName || "Unknown",
        appliedJobTitle: interview.jobTitle || "Unknown",
        resumeUrl: interview.candidateResumeUrl || "",
        email: "",
        phone: "",
        experienceYears: 0,
        education: "",
        appliedJobId: interview.jobId,
        channel: "",
        status: "new",
        appliedAt: new Date(),
      } as Candidate);
    }
  });
  return map;
};

export function CalendarTab() {
  const { t } = useTranslation();

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );

  // Calendar View State
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  // List View Pagination State
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const pageSize = 10;

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 1. Query for Calendar View (Range based, all statuses)
  const calendarRange = useMemo(() => {
    if (viewMode !== "calendar") return null;

    let start: Date, end: Date;
    if (view === Views.MONTH) {
      start = startOfMonth(date);
      end = endOfMonth(date);
    } else if (view === Views.WEEK) {
      start = startOfWeek(date);
      end = endOfWeek(date);
    } else {
      start = startOfMonth(date);
      end = endOfMonth(date);
    }
    return {
      start: start.toISOString(),
      end: end.toISOString(),
      pageSize: 1000, // Still need high limit for calendar view to show all events
      status:
        activeTab === "upcoming" ? ["PENDING"] : ["COMPLETED", "CANCELLED"],
    };
  }, [viewMode, view, date, activeTab]);

  const { data: calendarData, isLoading: isLoadingCalendar } = useInterviews(
    calendarRange || undefined,
  );

  // 2. Query for Upcoming List (Status=PENDING, Paginated)
  const upcomingQuery = useMemo(
    () => ({
      status: ["PENDING"],
      page: upcomingPage,
      pageSize: pageSize,
    }),
    [upcomingPage],
  );

  const { data: upcomingData, isLoading: isLoadingUpcoming } = useInterviews(
    viewMode === "list" && activeTab === "upcoming" ? upcomingQuery : undefined,
  );

  // 3. Query for History List (Status!=PENDING, Paginated)
  const historyQuery = useMemo(
    () => ({
      status: ["COMPLETED", "CANCELLED"],
      page: historyPage,
      pageSize: pageSize,
    }),
    [historyPage],
  );

  const { data: historyData, isLoading: isLoadingHistory } = useInterviews(
    viewMode === "list" && activeTab === "history" ? historyQuery : undefined,
  );

  const handlePreviewResume = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsPreviewOpen(true);
  };

  // Derived state for rendering
  const isListLoading =
    activeTab === "upcoming" ? isLoadingUpcoming : isLoadingHistory;
  const listData = activeTab === "upcoming" ? upcomingData : historyData;
  const calendarInterviews = calendarData?.interviews || [];

  // Maps
  const calendarCandidates = useMemo(
    () => getCandidatesMap(calendarInterviews),
    [calendarInterviews],
  );
  const listCandidates = useMemo(
    () => getCandidatesMap(listData?.interviews || []),
    [listData],
  );

  if (viewMode === "calendar" && isLoadingCalendar) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">
          {t("recruitment.calendar.title", "Interview Schedule")}
        </h2>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "upcoming" | "history")}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="upcoming">
              {t("recruitment.interviews.tabs.upcoming")}
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

        <div className="space-y-4">
          {viewMode === "list" ? (
            isListLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <>
                <RecruiterInterviewList
                  interviews={listData?.interviews || []}
                  candidatesById={listCandidates}
                  onPreviewResume={handlePreviewResume}
                  emptyTitle={
                    activeTab === "upcoming"
                      ? t(
                          "recruitment.interviews.noUpcomingInterviews",
                          "No Upcoming Interviews",
                        )
                      : t(
                          "recruitment.interviews.noHistoryInterviews",
                          "No Past Interviews",
                        )
                  }
                  emptyDesc={
                    activeTab === "upcoming"
                      ? t(
                          "recruitment.interviews.noUpcomingInterviewsDesc",
                          "No interviews scheduled for the future.",
                        )
                      : t(
                          "recruitment.interviews.noHistoryInterviewsDesc",
                          "No completed interviews yet.",
                        )
                  }
                />
                {/* Simple Pagination Controls */}
                {listData && listData.total > pageSize && (
                  <div className="flex items-center justify-end gap-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        activeTab === "upcoming"
                          ? setUpcomingPage((p) => Math.max(1, p - 1))
                          : setHistoryPage((p) => Math.max(1, p - 1))
                      }
                      disabled={
                        (activeTab === "upcoming"
                          ? upcomingPage
                          : historyPage) === 1
                      }
                    >
                      {t("common.previous", "Previous")}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {t("common.page", "Page")}{" "}
                      {activeTab === "upcoming" ? upcomingPage : historyPage}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        activeTab === "upcoming"
                          ? setUpcomingPage((p) => p + 1)
                          : setHistoryPage((p) => p + 1)
                      }
                      disabled={
                        (activeTab === "upcoming"
                          ? upcomingPage
                          : historyPage) *
                          pageSize >=
                        listData.total
                      }
                    >
                      {t("common.next", "Next")}
                    </Button>
                  </div>
                )}
              </>
            )
          ) : (
            <RecruiterInterviewCalendar
              interviews={calendarInterviews}
              candidates={calendarCandidates}
              onPreviewResume={handlePreviewResume}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
            />
          )}
        </div>
      </Tabs>

      <ResumePreviewModal
        candidate={selectedCandidate}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
}
