import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCandidateStatuses } from "@/hooks/useCandidateStatuses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, GripVertical, Plus, Pencil } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { CandidateStatusDefinition as CandidateStatus } from "@/types/candidate";

export function CandidateStatusSettings() {
  const { t } = useTranslation();
  const {
    statuses,
    createStatus,
    updateStatus,
    deleteStatus,
    reorderStatuses,
  } = useCandidateStatuses();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);

  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#000000");

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const items: CandidateStatus[] = Array.from(statuses);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    // Initial optimistic UI update (handled by React Query invalidation usually, but might jump)
    // To make it smooth, we should update local state if we had it.

    const ids = items.map((s) => s.id);
    reorderStatuses(ids);
  };

  const handleCreate = async () => {
    if (!newName) return;
    try {
      await createStatus(newName, newColor);
      setIsCreateOpen(false);
      setNewName("");
      setNewColor("#000000");
    } catch {
      // handled in hook
    }
  };

  const handleUpdate = async () => {
    if (!editingStatus) return;
    try {
      await updateStatus({
        id: editingStatus.id,
        name: editingStatus.name,
        color: editingStatus.color,
      });
      setEditingStatus(null);
    } catch {
      // handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStatus(id);
    } catch {
      // handled
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
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />{" "}
              {t("settings.candidateStatus.addStatus", "Add Status")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("settings.candidateStatus.addNew", "Add New Status")}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  {t("settings.candidateStatus.name", "Name")}
                </Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  {t("settings.candidateStatus.color", "Color")}
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>
                {t("common.create", "Create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  <Draggable
                    key={status.id}
                    draggableId={status.id}
                    index={index}
                  >
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
                              {t(
                                `settings.candidateStatus.type.${status.type}`,
                                status.type,
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog
                            open={editingStatus?.id === status.id}
                            onOpenChange={(open) =>
                              !open && setEditingStatus(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setEditingStatus({
                                    id: status.id,
                                    name: status.name,
                                    color: status.color,
                                  })
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  {t(
                                    "settings.candidateStatus.editStatus",
                                    "Edit Status",
                                  )}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-name"
                                    className="text-right"
                                  >
                                    {t("settings.candidateStatus.name", "Name")}
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={editingStatus?.name || ""}
                                    onChange={(e) =>
                                      setEditingStatus((prev) =>
                                        prev
                                          ? { ...prev, name: e.target.value }
                                          : null,
                                      )
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-color"
                                    className="text-right"
                                  >
                                    {t(
                                      "settings.candidateStatus.color",
                                      "Color",
                                    )}
                                  </Label>
                                  <div className="col-span-3 flex items-center gap-2">
                                    <Input
                                      id="edit-color"
                                      type="color"
                                      value={editingStatus?.color || ""}
                                      onChange={(e) =>
                                        setEditingStatus((prev) =>
                                          prev
                                            ? { ...prev, color: e.target.value }
                                            : null,
                                        )
                                      }
                                      className="w-12 h-10 p-1"
                                    />
                                    <Input
                                      value={editingStatus?.color || ""}
                                      onChange={(e) =>
                                        setEditingStatus((prev) =>
                                          prev
                                            ? { ...prev, color: e.target.value }
                                            : null,
                                        )
                                      }
                                      className="flex-1"
                                    />
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleUpdate}>
                                  {t("common.saveChanges", "Save Changes")}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {status.type !== "system" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {t("common.areYouSure", "Are you sure?")}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t(
                                      "settings.candidateStatus.deleteConfirm",
                                      'This action cannot be undone. This will permanently delete the status "{{name}}".',
                                      { name: status.name },
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    {t("common.cancel", "Cancel")}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(status.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {t("common.delete", "Delete")}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
