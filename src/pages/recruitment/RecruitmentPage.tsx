import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route } from "@/routes/_protected/recruitment";
import { useJobStore } from "@/stores/useJobStore";
import { CalendarTab } from "./components/calendar/CalendarTab";
import { CandidateManagement } from "./components/candidates/CandidateManagement";
import { JobManagementTab } from "./components/jobs/JobManagementTab";
import { RecruitmentHeader } from "./components/layout/RecruitmentHeader";
import { OverviewTab } from "./components/overview/OverviewTab";

export function RecruitmentPage() {
  const { t } = useTranslation();
  const { tab: activeTab = "overview" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { setIsAddDialogOpen } = useJobStore();

  const setActiveTab = (tab: string) => {
    navigate({
      search: (old) => ({
        ...old,
        tab: tab as "overview" | "jobs" | "candidates" | "calendar",
      }),
      replace: true,
    });
  };

  const handleAddJob = () => {
    setActiveTab("jobs");
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <RecruitmentHeader onAddJob={handleAddJob} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger value="overview">
            {t("recruitment.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="jobs">{t("recruitment.tabs.jobs")}</TabsTrigger>
          <TabsTrigger value="candidates">
            {t("recruitment.tabs.candidates")}
          </TabsTrigger>
          <TabsTrigger value="calendar">
            {t("recruitment.tabs.calendar")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="jobs">
          <JobManagementTab />
        </TabsContent>

        <TabsContent value="candidates" className="h-full">
          <CandidateManagement />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
