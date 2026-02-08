import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  Candidate,
  CandidateStatus,
  CandidateStatusDefinition as ApiCandidateStatus,
} from "@/types/candidate";
import { useCandidateStatuses } from "@/hooks/useCandidateStatuses";
import { AssignInterviewerDialog } from "../../interviews/AssignInterviewerDialog";

interface CandidateDetailHeaderProps {
  candidate: Candidate;
  onStatusChange: (status: CandidateStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CandidateDetailHeader({
  candidate,
  onStatusChange,
  onEdit,
  onDelete,
}: CandidateDetailHeaderProps) {
  const { t } = useTranslation();
  const { statuses } = useCandidateStatuses();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  return (
    <DialogHeader className="p-6 pb-4 border-b shrink-0 bg-background z-10">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback className="text-lg">
              {candidate.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <DialogTitle className="text-2xl">{candidate.name}</DialogTitle>
            <DialogDescription>
              {t("recruitment.candidates.detail.appliedPosition")}
              <span className="font-medium text-foreground">
                {candidate.appliedJobTitle}
              </span>
            </DialogDescription>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {t(
                  "recruitment.candidates.form.channels." +
                    candidate.channel.toLowerCase(),
                  candidate.channel,
                )}
              </Badge>
              <Badge variant="outline">
                {t("recruitment.candidates.card.yearsExp", {
                  years: candidate.experienceYears,
                })}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={candidate.status}
            onValueChange={(v) => onStatusChange(v as CandidateStatus)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status: ApiCandidateStatus) => (
                <SelectItem key={status.slug} value={status.slug}>
                  {status.type === "system"
                    ? t(
                        `recruitment.candidates.statusOptions.${status.slug}`,
                        status.name,
                      )
                    : status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("common.openMenu")}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsAssignDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />{" "}
                {t("recruitment.candidates.detail.assignInterviewer")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" /> {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" /> {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AssignInterviewerDialog
        candidate={candidate}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
      />
    </DialogHeader>
  );
}
