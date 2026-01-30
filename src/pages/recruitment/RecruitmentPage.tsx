import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JobPosition } from "@/types/job";
import { JobPositionList } from "./components/JobPositionList";
import { type JobFormValues } from "./components/JobPositionForm";
import { CandidateManagement } from "./components/CandidateManagement";
import { RecruitmentHeader } from "./components/RecruitmentHeader";
import { OverviewTab } from "./components/OverviewTab";
import { CalendarTab } from "./components/CalendarTab";
import { JobDialogs } from "./components/JobDialogs";

// Mock initial data
const INITIAL_JOBS: JobPosition[] = [
  {
    id: "1",
    title: "高级前端工程师",
    department: "产品研发部",
    headCount: 2,
    openDate: new Date("2024-05-01"),
    jobDescription: "负责公司核心产品的前端研发工作...",
    note: "优先考虑有React经验的候选人",
    status: "OPEN",
  },
  {
    id: "2",
    title: "产品经理",
    department: "产品部",
    headCount: 1,
    openDate: new Date("2024-05-15"),
    jobDescription: "负责产品规划和设计...",
    note: "",
    status: "OPEN",
  },
];

export function RecruitmentPage() {
  const [jobs, setJobs] = useState<JobPosition[]>(INITIAL_JOBS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosition | undefined>(undefined);
  const [viewingJob, setViewingJob] = useState<JobPosition | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("overview");

  const handleAddJob = () => {
    setEditingJob(undefined);
    setIsDialogOpen(true);
  };

  const handleEditJob = (job: JobPosition) => {
    setEditingJob(job);
    setIsDialogOpen(true);
  };

  const handleViewJob = (job: JobPosition) => {
    setViewingJob(job);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleStatusToggle = (job: JobPosition) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? { ...j, status: j.status === "OPEN" ? "CLOSED" : "OPEN" }
          : j
      )
    );
  };

  const handleSaveJob = (data: JobFormValues) => {
    if (editingJob) {
      // Update existing
      setJobs((prev) =>
        prev.map((job) =>
          job.id === editingJob.id ? { ...job, ...data } : job
        )
      );
    } else {
      // Create new
      const newJob: JobPosition = {
        ...data,
        id: Math.random().toString(36).substr(2, 9), // Simple ID generation
        status: data.status || "OPEN",
      };
      setJobs((prev) => [newJob, ...prev]);
    }
    setIsDialogOpen(false);
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
          <JobPositionList
            jobs={jobs}
            onEdit={handleEditJob}
            onDelete={handleDeleteJob}
            onView={handleViewJob}
            onStatusToggle={handleStatusToggle}
          />
        </TabsContent>

        <TabsContent value="candidates" className="h-full">
          <CandidateManagement jobs={jobs} />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarTab />
        </TabsContent>
      </Tabs>

      <JobDialogs
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingJob={editingJob}
        handleSaveJob={handleSaveJob}
        viewingJob={viewingJob}
        setViewingJob={setViewingJob}
      />
    </div>
  );
}
