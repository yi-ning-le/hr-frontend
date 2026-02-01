import { useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { Candidate, CandidateStatus } from "@/types/candidate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface CandidateKanbanProps {
  candidates: Candidate[];
  onDragEnd: (result: DropResult) => void;
  onCandidateClick: (candidate: Candidate) => void;
}

const COLUMNS: { id: CandidateStatus; title: string; color: string }[] = [
  { id: "new", title: "新申请", color: "bg-blue-500/10 text-blue-500" },
  { id: "screening", title: "筛选中", color: "bg-purple-500/10 text-purple-500" },
  { id: "interview", title: "面试中", color: "bg-orange-500/10 text-orange-500" },
  { id: "offer", title: "Offer", color: "bg-green-500/10 text-green-500" },
  { id: "hired", title: "已入职", color: "bg-emerald-600/10 text-emerald-600" },
  { id: "rejected", title: "已淘汰", color: "bg-red-500/10 text-red-500" },
];

export function CandidateKanban({ candidates, onDragEnd, onCandidateClick }: CandidateKanbanProps) {

  const groupedCandidates = useMemo(() => {
    const groups: Record<CandidateStatus, Candidate[]> = {
      new: [],
      screening: [],
      interview: [],
      offer: [],
      hired: [],
      rejected: [],
    };
    candidates.forEach((c) => {
      if (groups[c.status]) {
        groups[c.status].push(c);
      }
    });
    return groups;
  }, [candidates]);

  return (
    <div className="flex h-full overflow-x-auto p-4 gap-4 bg-slate-50/50 dark:bg-slate-900/50">
      <DragDropContext onDragEnd={onDragEnd}>
        {COLUMNS.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80 flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${column.color.split(" ")[0].replace("/10", "")}`} />
                <span className="font-semibold text-sm">{column.title}</span>
                <span className="text-xs text-muted-foreground bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {groupedCandidates[column.id].length}
                </span>
              </div>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 rounded-lg transition-colors p-2 gap-3 flex flex-col ${snapshot.isDraggingOver ? "bg-slate-100 dark:bg-slate-800/50" : "bg-transparent"
                    }`}
                  style={{ minHeight: "200px" }}
                >
                  {groupedCandidates[column.id].map((candidate, index) => (
                    <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onCandidateClick(candidate)}
                          className={`cursor-pointer hover:shadow-md transition-shadow ${snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20 rotate-2" : ""
                            }`}
                        >
                          <CardContent className="p-3 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={candidate.avatar} />
                                  <AvatarFallback>{candidate.name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm leading-none">{candidate.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">{candidate.appliedJobTitle}</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              <Badge variant="secondary" className="text-[10px] h-5 px-1 font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {candidate.experienceYears}年经验
                              </Badge>
                              <Badge variant="secondary" className="text-[10px] h-5 px-1 font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {candidate.education}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
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
