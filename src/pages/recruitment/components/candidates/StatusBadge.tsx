import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, FileText, Users, CheckCircle2, XCircle } from "lucide-react";
import type { CandidateStatus } from "@/types/candidate";

interface StatusBadgeProps {
  status: CandidateStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const map: Record<CandidateStatus, { label: string; className: string; icon: React.ElementType }> = {
    new: {
      label: "新投递",
      className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: Clock,
    },
    screening: {
      label: "筛选中",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      icon: FileText,
    },
    interview: {
      label: "面试中",
      className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      icon: Users,
    },
    offer: {
      label: "Offer",
      className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: CheckCircle2,
    },
    hired: {
      label: "已入职",
      className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      icon: Users,
    },
    rejected: {
      label: "已淘汰",
      className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      icon: XCircle,
    },
  };

  const config = map[status] || map.new;

  return (
    <Badge variant="outline" className={cn("gap-1 font-normal", config.className, className)}>
      {config.label}
    </Badge>
  );
}
