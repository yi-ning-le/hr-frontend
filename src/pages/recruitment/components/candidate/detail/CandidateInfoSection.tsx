import { format } from "date-fns";
import { Users, Mail, Phone } from "lucide-react";
import type { Candidate } from "@/types/candidate";

interface CandidateInfoSectionProps {
  candidate: Candidate;
}

export function CandidateInfoSection({ candidate }: CandidateInfoSectionProps) {
  return (
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
            {format(new Date(candidate.appliedAt), "yyyy-MM-dd HH:mm")}
          </div>
        </div>
      </div>
    </section>
  );
}
