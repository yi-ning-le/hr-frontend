import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CandidateStatus } from "@/types/candidate"; // This is likely string now
import { useCandidateStatuses } from "@/hooks/useCandidateStatuses";

interface StatusBadgeProps {
  status: CandidateStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  const { statusMap } = useCandidateStatuses();

  const statusObj = statusMap[status];

  if (!statusObj) {
    // Fallback if status not found (e.g. loading or deleted)
    return (
      <Badge
        variant="outline"
        className={cn("gap-1 font-normal capitalize", className)}
      >
        {status}
      </Badge>
    );
  }

  // Determine label: try translate if system, else use name
  const label =
    statusObj.type === "system"
      ? t(
          `recruitment.candidates.statusOptions.${statusObj.slug}`,
          statusObj.name,
        )
      : statusObj.name;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1 font-normal text-white border-0", className)}
      style={{ backgroundColor: statusObj.color }}
    >
      {label}
    </Badge>
  );
}
