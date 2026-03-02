import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { PersonCombobox } from "@/components/candidates/PersonCombobox";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useReviewers } from "@/hooks/queries/useReviewers";
import { CandidatesAPI } from "@/lib/api";
import type { Candidate } from "@/types/candidate";

type AssignFormValues = {
  reviewerId: string;
};

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
  const { data: reviewers } = useReviewers();

  const assignSchema = useMemo(
    () =>
      z.object({
        reviewerId: z
          .string()
          .min(
            1,
            t(
              "candidate.validation.reviewerRequired",
              "Please select a reviewer",
            ),
          ),
      }),
    [t],
  );

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
                  <PersonCombobox
                    options={(reviewers ?? []).map((r) => ({
                      id: r.employeeId,
                      firstName: r.firstName,
                      lastName: r.lastName,
                      department: r.department,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t(
                      "candidate.selectReviewer",
                      "Select reviewer",
                    )}
                    searchPlaceholder={t("common.search", "Search…")}
                    emptyMessage={t("common.noResults", "No results found.")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.saving", "Saving…")}
                  </>
                ) : (
                  t("common.save", "Save")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
