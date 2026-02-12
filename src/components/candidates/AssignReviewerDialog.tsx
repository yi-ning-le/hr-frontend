import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployees } from "@/hooks/queries/useEmployees";
import { CandidatesAPI } from "@/lib/api";
import type { Candidate } from "@/types/candidate";

const createAssignSchema = (
  t: (key: string, defaultValue?: string) => string,
) =>
  z.object({
    reviewerId: z
      .string()
      .min(
        1,
        t("candidate.validation.reviewerRequired", "Please select a reviewer"),
      ),
  });

type AssignFormValues = z.infer<ReturnType<typeof createAssignSchema>>;

interface AssignReviewerDialogProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignReviewerDialog({
  candidate,
  open,
  onOpenChange,
}: AssignReviewerDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: employeesData } = useEmployees({ status: "Active" }); // Fetch all active employees

  const assignSchema = useMemo(() => createAssignSchema(t), [t]);

  const form = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      reviewerId: candidate.reviewerId || "",
    },
  });

  const onSubmit = async (values: AssignFormValues) => {
    setIsSubmitting(true);
    try {
      await CandidatesAPI.assignReviewer(candidate.id, values.reviewerId);
      toast.success(
        t("candidate.assignSuccess", "Reviewer assigned successfully"),
      );
      queryClient.invalidateQueries({ queryKey: ["candidates"] }); // To refresh candidate list or detail
      queryClient.invalidateQueries({ queryKey: ["pending-resumes"] }); // Refresh pending list for the reviewer
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to assign reviewer:", error);
      toast.error(t("candidate.assignFailed", "Failed to assign reviewer"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("candidate.assignReviewerTitle", "Assign Reviewer")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "candidate.assignDescription",
              "Select an interviewer to review this candidate.",
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reviewerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("candidate.reviewer", "Reviewer")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "candidate.selectReviewer",
                            "Select reviewer",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employeesData?.employees?.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("common.saving", "Saving...")
                  : t("common.save", "Save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
