import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const recentApplications = [
  {
    id: 1,
    name: "张伟",
    role: "高级前端工程师",
    appliedDate: "2小时前",
    status: "new",
    avatar: "",
  },
  {
    id: 2,
    name: "李娜",
    role: "产品经理",
    appliedDate: "4小时前",
    status: "reviewing",
    avatar: "",
  },
  {
    id: 3,
    name: "王强",
    role: "UI设计师",
    appliedDate: "1天前",
    status: "interview",
    avatar: "",
  },
  {
    id: 4,
    name: "赵敏",
    role: "后端开发工程师",
    appliedDate: "1天前",
    status: "new",
    avatar: "",
  },
];

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" | null }> = {
  new: { label: "新申请", variant: "default" },
  reviewing: { label: "筛选中", variant: "secondary" },
  interview: { label: "面试中", variant: "outline" },
};

export function RecentApplications() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">最近申请</CardTitle>
        <Button variant="ghost" size="sm">查看全部</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentApplications.map((app) => (
            <div key={app.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={app.avatar} />
                  <AvatarFallback>{app.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">
                    {app.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    申请职位: {app.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={statusMap[app.status]?.variant as any} className="hidden sm:flex">
                  {statusMap[app.status]?.label}
                </Badge>
                <div className="text-xs text-slate-400 w-16 text-right">
                  {app.appliedDate}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
