import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { CandidatesAPI } from "@/lib/api";
import type { Candidate } from "@/types/candidate";

const reviewSchema = z.object({
  reviewStatus: z.enum(["suitable", "unsuitable"]),
  reviewNote: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewCandidateDialogProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewCandidateDialog({
  candidate,
  open,
  onOpenChange,
}: ReviewCandidateDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      reviewStatus: "suitable", // Default to suitable? Or empty?
      reviewNote: "",
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      await CandidatesAPI.review(
        candidate.id,
        values.reviewStatus,
        values.reviewNote,
      );
      toast.success(
        t("candidate.reviewSuccess", "Review submitted successfully"),
      );
      queryClient.invalidateQueries({ queryKey: ["pending-resumes"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(t("candidate.reviewFailed", "Failed to submit review"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("candidate.reviewTitle", "Review Candidate")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "candidate.reviewDescription",
              "Provide your feedback for {{name}}.",
              { name: candidate.name },
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reviewStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("candidate.reviewStatus", "Decision")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "candidate.selectDecision",
                            "Select decision",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="suitable">
                        {t("candidate.suitable", "Suitable")}
                      </SelectItem>
                      <SelectItem value="unsuitable">
                        {t("candidate.unsuitable", "Unsuitable")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reviewNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("candidate.reviewNote", "Comments")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "candidate.reviewNotePlaceholder",
                        "Add any comments here...",
                      )}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("common.submitting", "Submitting...")
                  : t("common.submit", "Submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
