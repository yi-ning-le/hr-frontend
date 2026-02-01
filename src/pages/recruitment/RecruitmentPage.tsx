import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateManagement } from "./components/candidates/CandidateManagement";
import { RecruitmentHeader } from "./components/layout/RecruitmentHeader";
import { OverviewTab } from "./components/overview/OverviewTab";
import { CalendarTab } from "./components/calendar/CalendarTab";
import { JobManagementTab } from "./components/jobs/JobManagementTab";
import { useJobStore } from "@/stores/useJobStore";
import { Route } from "@/routes/recruitment";

export function RecruitmentPage() {
  const { tab: activeTab = "overview" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { setIsAddDialogOpen } = useJobStore();

  const setActiveTab = (tab: string) => {
    navigate({
      search: (old) => ({ ...old, tab: tab as any }),
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="jobs">职位管理</TabsTrigger>
          <TabsTrigger value="candidates">候选人</TabsTrigger>
          <TabsTrigger value="calendar">面试日程</TabsTrigger>
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

