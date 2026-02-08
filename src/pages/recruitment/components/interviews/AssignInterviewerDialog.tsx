import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import { useEmployees } from "@/hooks/queries/useEmployees";
import { useCreateInterview } from "@/hooks/queries/useInterviews";
import { toast } from "sonner";
import type { Candidate } from "@/types/candidate";

interface AssignInterviewerDialogProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignInterviewerDialog({
  candidate,
  open,
  onOpenChange,
}: AssignInterviewerDialogProps) {
  const { t } = useTranslation();

  const formSchema = z.object({
    interviewerId: z
      .string()
      .min(1, t("recruitment.interviews.validation.interviewerRequired")),
    scheduledTime: z.date({
      message: t("recruitment.interviews.validation.scheduledTimeRequired"),
    }),
    notes: z.string().optional(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch employees to select from
  const { data: employeeData } = useEmployees({ limit: 100, status: "Active" }); // Simple fetch, maybe need search later
  const employees = employeeData?.employees || [];

  const { mutateAsync: createInterview } = useCreateInterview();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interviewerId: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await createInterview({
        candidateId: candidate.id,
        jobId: candidate.appliedJobId,
        interviewerId: values.interviewerId,
        scheduledTime: values.scheduledTime,
        notes: values.notes,
      });
      toast.success(t("recruitment.interviews.assignSuccess"));
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(t("recruitment.interviews.assignFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("recruitment.interviews.assignTitle")}</DialogTitle>
          <DialogDescription>
            {t("recruitment.interviews.assignDescription", {
              candidateName: candidate.name,
            })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="interviewerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("recruitment.interviews.interviewer")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "recruitment.interviews.selectInterviewer",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
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

            <FormField
              control={form.control}
              name="scheduledTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {t("recruitment.interviews.scheduledTime")}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t("common.pickDate")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("recruitment.interviews.initialNotes")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("recruitment.interviews.notesPlaceholder")}
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
                {isSubmitting && (
                  <UserPlus className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("common.assign")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
