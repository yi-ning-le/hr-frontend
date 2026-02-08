import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { CandidateStatusDefinition } from "@/types/candidate";

const statusSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color code"),
});

type StatusFormValues = z.infer<typeof statusSchema>;

interface CandidateStatusDialogProps {
  mode: "create" | "edit";
  status?: CandidateStatusDefinition | null; // For edit mode
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: StatusFormValues) => Promise<void>;
  trigger?: React.ReactNode;
}

export function CandidateStatusDialog({
  mode,
  status,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSubmit,
  trigger,
}: CandidateStatusDialogProps) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      name: "",
      color: "#000000",
    },
  });

  // Reset form when status changes (edit mode) or dialog opens
  useEffect(() => {
    if (open) {
      if (mode === "edit" && status) {
        form.reset({
          name: status.name,
          color: status.color,
        });
      } else if (mode === "create") {
        form.reset({
          name: "",
          color: "#000000",
        });
      }
    }
  }, [open, status, mode, form]);

  const handleSubmit = async (data: StatusFormValues) => {
    try {
      await onSubmit(data);
      setOpen(false);
      if (mode === "create") {
        form.reset();
      }
    } catch {
      // handled by parent
    }
  };

  const title =
    mode === "create"
      ? t("settings.candidateStatus.addNew", "Add New Status")
      : t("settings.candidateStatus.editStatus", "Edit Status");

  const submitLabel =
    mode === "create"
      ? t("common.create", "Create")
      : t("common.saveChanges", "Save Changes");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">
                    {t("settings.candidateStatus.name", "Name")}
                  </FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">
                    {t("settings.candidateStatus.color", "Color")}
                  </FormLabel>
                  <div className="col-span-3 flex items-center gap-2">
                    <FormControl>
                      <div className="flex gap-2 w-full">
                        <Input
                          type="color"
                          {...field}
                          className="w-12 h-10 p-1"
                        />
                        <Input {...field} className="flex-1" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{submitLabel}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
