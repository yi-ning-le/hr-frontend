import { useState } from "react";
import { format } from "date-fns";
import {
  Users,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CandidateStatus } from "@/types/candidate"; // Type only, data from store
import { useCandidateStore } from "@/stores/useCandidateStore";
import { ResumePreviewModal } from "./ResumePreviewModal";

export function CandidateDetail() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Use store
  const selectedCandidateId = useCandidateStore((state) => state.selectedCandidateId);
  const candidates = useCandidateStore((state) => state.candidates);
  const updateCandidateStatus = useCandidateStore((state) => state.updateCandidateStatus);
  const updateCandidateNote = useCandidateStore((state) => state.updateCandidateNote);

  const candidate = candidates.find((c) => c.id === selectedCandidateId);

  if (!candidate) return null;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <DialogHeader className="p-6 pb-4 border-b shrink-0 bg-background z-10">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-lg">
                {candidate.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <DialogTitle className="text-2xl">{candidate.name}</DialogTitle>
              <DialogDescription>
                申请职位：
                <span className="font-medium text-foreground">
                  {candidate.appliedJobTitle}
                </span>
              </DialogDescription>
              <div className="flex gap-2">
                <Badge variant="secondary">{candidate.channel}</Badge>
                <Badge variant="outline">
                  {candidate.experienceYears}年经验
                </Badge>
              </div>
            </div>
          </div>

          <Select
            value={candidate.status}
            onValueChange={(v) => updateCandidateStatus(candidate.id, v as CandidateStatus)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">新投递</SelectItem>
              <SelectItem value="screening">筛选中</SelectItem>
              <SelectItem value="interview">面试中</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="hired">已入职</SelectItem>
              <SelectItem value="rejected">已淘汰</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 min-h-0 w-full">
        <div className="p-6 pb-20 grid gap-8">
          {/* Basic Info */}
          <section>
            <h4 className="mb-4 text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" /> 基本信息
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">邮箱</label>
                <div className="flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {candidate.email}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">电话</label>
                <div className="flex items-center gap-2 font-medium">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {candidate.phone}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">教育背景</label>
                <div className="font-medium">{candidate.education}</div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">申请时间</label>
                <div className="font-medium">
                  {format(candidate.appliedAt, "yyyy-MM-dd HH:mm")}
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Resume Preview */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> 简历预览
              </h4>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                下载简历
              </Button>
            </div>
            <div className="rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 p-12 text-center text-sm text-muted-foreground min-h-[240px] flex flex-col items-center justify-center border-dashed">
              <FileText className="h-12 w-12 mb-3 opacity-20" />
              <p className="font-medium mb-2">PDF预览组件在此处集成</p>
              <Button onClick={() => setIsPreviewOpen(true)} variant="secondary" size="sm">
                全屏预览简历
              </Button>
            </div>
          </section>

          <Separator />

          {/* Notes */}
          <section className="space-y-4 pb-4">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" /> 面试官备注
            </h4>
            <div className="space-y-3">
              <Textarea
                placeholder="添加候选人备注..."
                value={candidate.note || ""}
                onChange={(e) => updateCandidateNote(candidate.id, e.target.value)}
                className="min-h-[120px] resize-none focus-visible:ring-primary"
              />
              <div className="flex justify-end">
                <Button size="sm" className="px-6">
                  保存备注
                </Button>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>

      {/* Resume Preview Modal (controlled locally) */}
      <ResumePreviewModal
        candidate={candidate}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
}
