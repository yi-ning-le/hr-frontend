import { useState } from "react";
import { JobPositionDetail } from "./components/JobPositionDetail";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecruitmentStats } from "./components/RecruitmentStats";
import { RecentApplications } from "./components/RecentApplications";
import { Plus, ListFilter } from "lucide-react";
import type { JobPosition } from "@/types/job";
import { JobPositionList } from "./components/JobPositionList";
import { JobPositionForm, type JobFormValues } from "./components/JobPositionForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            招聘管理
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            管理职位发布、候选人跟进及招聘数据分析
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ListFilter className="mr-2 h-4 w-4" />
            筛选视图
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
            onClick={handleAddJob}
          >
            <Plus className="mr-2 h-4 w-4" />
            发布新职位
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="jobs">职位管理</TabsTrigger>
          <TabsTrigger value="candidates">候选人</TabsTrigger>
          <TabsTrigger value="calendar">面试日程</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <RecruitmentStats />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <RecentApplications />

            {/* Quick Actions / Pipeline Placeholder */}
            <div className="space-y-6">
              {/* Recruitment Pipeline Funnel Placeholder */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                  招聘漏斗
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">简历筛选</span>
                    <span className="font-bold">120</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">初试</span>
                    <span className="font-bold">45</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[37%]"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">复试</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[10%]"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Offer</span>
                    <span className="font-bold">5</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[4%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <JobPositionList
            jobs={jobs}
            onEdit={handleEditJob}
            onDelete={handleDeleteJob}
            onView={handleViewJob}
          />
        </TabsContent>

        <TabsContent value="candidates">
          <div className="flex h-100 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="text-center">
              <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                候选人库
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                在此展示所有候选人及其状态。
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="flex h-100 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="text-center">
              <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                面试日历
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                在此展示面试安排日程。
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{editingJob ? "编辑职位" : "发布新职位"}</DialogTitle>
            <DialogDescription>
              填写职位详情信息，完成后点击保存。
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-hidden">
            <JobPositionForm
              className="h-full"
              initialData={editingJob}
              onSubmit={handleSaveJob}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingJob} onOpenChange={(open) => !open && setViewingJob(undefined)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{viewingJob?.title}</DialogTitle>
            <DialogDescription>
              职位详情
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden px-1 min-h-0">
            {viewingJob && <JobPositionDetail job={viewingJob} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
