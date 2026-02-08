import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCandidateStatuses } from "@/hooks/useCandidateStatuses";
import type { CandidateStatusDefinition as CandidateStatus } from "@/types/candidate";
import { CandidateStatusDialog } from "./candidate-status/CandidateStatusDialog";
import { StatusItem } from "./candidate-status/StatusItem";

export function CandidateStatusSettings() {
  const { t } = useTranslation();
  const {
    statuses,
    createStatus,
    updateStatus,
    deleteStatus,
    reorderStatuses,
  } = useCandidateStatuses();

  const [editingStatus, setEditingStatus] = useState<CandidateStatus | null>(
    null,
  );
  const [deletingStatus, setDeletingStatus] = useState<CandidateStatus | null>(
    null,
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const items: CandidateStatus[] = Array.from(statuses);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    // Initial optimistic UI update
    const ids = items.map((s) => s.id);
    reorderStatuses(ids);
  };

  const handleCreate = async (data: { name: string; color: string }) => {
    await createStatus(data.name, data.color);
  };

  const handleUpdate = async (data: { name: string; color: string }) => {
    if (editingStatus) {
      await updateStatus({
        id: editingStatus.id,
        name: data.name,
        color: data.color,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            {t("settings.candidateStatus.title", "Candidate Statuses")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t(
              "settings.candidateStatus.description",
              "Manage the candidate pipeline statuses. Drag to reorder.",
            )}
          </p>
        </div>
        <CandidateStatusDialog
          mode="create"
          onSubmit={handleCreate}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />{" "}
              {t("settings.candidateStatus.addStatus", "Add Status")}
            </Button>
          }
        />
      </div>

      <div className="border rounded-md">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="statuses">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="divide-y"
              >
                {statuses.map((status: CandidateStatus, index: number) => (
                  <StatusItem
                    key={status.id}
                    status={status}
                    index={index}
                    onEdit={setEditingStatus}
                    onDelete={setDeletingStatus}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <CandidateStatusDialog
        mode="edit"
        status={editingStatus}
        onSubmit={handleUpdate}
        open={!!editingStatus}
        onOpenChange={(open) => !open && setEditingStatus(null)}
      />

      <AlertDialog
        open={!!deletingStatus}
        onOpenChange={(open) => !open && setDeletingStatus(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("common.areYouSure", "Are you sure?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "settings.candidateStatus.deleteConfirm",
                'This action cannot be undone. This will permanently delete the status "{{name}}".',
                { name: deletingStatus?.name },
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("common.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingStatus) {
                  deleteStatus(deletingStatus.id);
                  setDeletingStatus(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
