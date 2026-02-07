import { useTranslation } from "react-i18next";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { CandidateStatusDefinition } from "@/types/candidate";

interface StatusItemProps {
  status: CandidateStatusDefinition;
  index: number;
  onEdit: (status: CandidateStatusDefinition) => void;
  onDelete: (status: CandidateStatusDefinition) => void;
}

export function StatusItem({
  status,
  index,
  onEdit,
  onDelete,
}: StatusItemProps) {
  const { t } = useTranslation();

  return (
    <Draggable draggableId={status.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex items-center justify-between p-4 bg-card"
        >
          <div className="flex items-center gap-4">
            <div
              {...provided.dragHandleProps}
              className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5" />
            </div>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            <div>
              <p className="font-medium">
                {status.type === "system"
                  ? t(
                      `recruitment.candidates.statusOptions.${status.slug}`,
                      status.name,
                    )
                  : status.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {t("settings.candidateStatus.type." + status.type, status.type)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(status)}>
              <Pencil className="h-4 w-4" />
            </Button>

            {status.type !== "system" && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(status)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
