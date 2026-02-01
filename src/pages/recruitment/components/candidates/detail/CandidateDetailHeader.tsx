import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
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
import type { Candidate, CandidateStatus } from "@/types/candidate";

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

        <div className="flex items-center gap-2">
          <Select
            value={candidate.status}
            onValueChange={(v) => onStatusChange(v as CandidateStatus)}
          >
            <SelectTrigger className="w-[120px]">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </DialogHeader>
  );
}
