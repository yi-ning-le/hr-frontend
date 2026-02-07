import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { Candidate } from "@/types/candidate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCandidateStatuses } from "@/hooks/useCandidateStatuses";
import type { CandidateStatusDefinition as CandidateStatus } from "@/types/candidate";

interface CandidateKanbanProps {
  candidates: Candidate[];
  onDragEnd: (result: DropResult) => void;
  onCandidateClick: (candidate: Candidate) => void;
}

export function CandidateKanban({
  candidates,
  onDragEnd,
  onCandidateClick,
}: CandidateKanbanProps) {
  const { t } = useTranslation();
  const { statuses } = useCandidateStatuses();

  const groupedCandidates = useMemo(() => {
    const groups: Record<string, Candidate[]> = {};
    statuses.forEach((s: CandidateStatus) => {
      groups[s.slug] = [];
    });

    candidates.forEach((c) => {
      // If candidate status is valid (exists in statuses), add it
      // If not (maybe deleted status), we could handle it. For now, we only add if exists or maybe fallback?
      // Let's safe guard:
      if (!groups[c.status]) {
        // You might want to show these in a specific "Unknown" column or just create the entry
        // creating entry means it won't show in the column map iteration unless we handle it there.
        // For now, let's assume candidates always have valid status or won't be shown.
        return;
      }
      groups[c.status].push(c);
    });
    return groups;
  }, [candidates, statuses]);

  return (
    <div className="flex h-full overflow-x-auto p-4 gap-4 bg-slate-50/50 dark:bg-slate-900/50">
      <DragDropContext onDragEnd={onDragEnd}>
        {statuses.map((status: CandidateStatus) => (
          <div
            key={status.slug}
            className="flex-shrink-0 w-80 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="font-semibold text-sm">
                  {status.type === "system"
                    ? t(
                        `recruitment.candidates.statusOptions.${status.slug}`,
                        status.name,
                      )
                    : status.name}
                </span>
                <span className="text-xs text-muted-foreground bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {groupedCandidates[status.slug]?.length || 0}
                </span>
              </div>
            </div>

            <Droppable droppableId={status.slug}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 rounded-lg transition-colors p-2 gap-3 flex flex-col ${
                    snapshot.isDraggingOver
                      ? "bg-slate-100 dark:bg-slate-800/50"
                      : "bg-transparent"
                  }`}
                  style={{ minHeight: "200px" }}
                >
                  {(groupedCandidates[status.slug] || []).map(
                    (candidate, index) => (
                      <Draggable
                        key={candidate.id}
                        draggableId={candidate.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onCandidateClick(candidate)}
                            className={`cursor-pointer hover:shadow-md transition-shadow ${
                              snapshot.isDragging
                                ? "shadow-lg ring-2 ring-primary/20 rotate-2"
                                : ""
                            }`}
                          >
                            <CardContent className="p-3 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={candidate.avatar} />
                                    <AvatarFallback>
                                      {candidate.name.slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-sm leading-none">
                                      {candidate.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {candidate.appliedJobTitle}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] h-5 px-1 font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                >
                                  {t("recruitment.candidates.card.yearsExp", {
                                    years: candidate.experienceYears,
                                  })}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] h-5 px-1 font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                >
                                  {candidate.education}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ),
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
