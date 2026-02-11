import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCandidateStatuses } from "@/hooks/useCandidateStatuses";
import type {
  Candidate,
  CandidateStatusDefinition as CandidateStatus,
} from "@/types/candidate";

interface CandidateKanbanProps {
  candidates: Candidate[];
  onDragEnd: (result: DropResult) => void;
  onCandidateClick: (candidate: Candidate) => void;
}

export const UNKNOWN_CANDIDATE_STATUS_SLUG = "__unknown__";

export function CandidateKanban({
  candidates,
  onDragEnd,
  onCandidateClick,
}: CandidateKanbanProps) {
  const { t } = useTranslation();
  const { statuses } = useCandidateStatuses();

  const statusSet = useMemo(
    () => new Set(statuses.map((status) => status.slug)),
    [statuses],
  );

  const hasUnknownCandidates = useMemo(
    () => candidates.some((candidate) => !statusSet.has(candidate.status)),
    [candidates, statusSet],
  );

  const displayStatuses = useMemo(() => {
    if (!hasUnknownCandidates) {
      return statuses;
    }

    return [
      ...statuses,
      {
        id: UNKNOWN_CANDIDATE_STATUS_SLUG,
        name: t("common.unknown", "Unknown"),
        slug: UNKNOWN_CANDIDATE_STATUS_SLUG,
        type: "system" as const,
        sort_order: Number.MAX_SAFE_INTEGER,
        color: "#64748b",
      },
    ];
  }, [hasUnknownCandidates, statuses, t]);

  const groupedCandidates = useMemo(() => {
    const groups: Record<string, Candidate[]> = {};
    displayStatuses.forEach((s: CandidateStatus) => {
      groups[s.slug] = [];
    });

    candidates.forEach((c) => {
      if (!groups[c.status]) {
        groups[UNKNOWN_CANDIDATE_STATUS_SLUG].push(c);
        return;
      }
      groups[c.status].push(c);
    });
    return groups;
  }, [candidates, displayStatuses]);

  return (
    <div className="flex h-full overflow-x-auto p-4 gap-4 bg-slate-50/50 dark:bg-slate-900/50">
      <DragDropContext onDragEnd={onDragEnd}>
        {displayStatuses.map((status: CandidateStatus) => (
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

            <Droppable
              droppableId={status.slug}
              isDropDisabled={status.slug === UNKNOWN_CANDIDATE_STATUS_SLUG}
            >
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
