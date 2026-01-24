import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecruitmentStats } from "./components/RecruitmentStats";
import { RecentApplications } from "./components/RecentApplications";
import { Plus, ListFilter } from "lucide-react";

export function RecruitmentPage() {
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
          >
            <Plus className="mr-2 h-4 w-4" />
            发布新职位
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
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
          <div className="flex h-100 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="text-center">
              <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                职位列表
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                在此展示职位看板或列表。
              </p>
            </div>
          </div>
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
    </div>
  );
}
