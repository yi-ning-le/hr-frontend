import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfToday } from "date-fns";
import { enUS, zhCN } from "date-fns/locale";
import { CalendarIcon, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";

import { useInterviewers } from "@/hooks/queries/useInterviewers";
import { useCreateInterview } from "@/hooks/queries/useInterviews";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/candidate";

interface AssignInterviewerDialogProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const combineDateAndTime = (date: Date, timeSlot: string) => {
  const [hour, minute] = timeSlot.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result;
};

export function AssignInterviewerDialog({
  candidate,
  open,
  onOpenChange,
}: AssignInterviewerDialogProps) {
  const { t, i18n } = useTranslation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formSchema = z
    .object({
      interviewerId: z
        .string()
        .min(1, t("recruitment.interviews.validation.interviewerRequired")),
      date: z.date({
        message: t("recruitment.interviews.validation.dateRequired"),
      }),
      startTime: z
        .string({
          error: t("recruitment.interviews.validation.startTimeRequired"),
        })
        .min(1, t("recruitment.interviews.validation.startTimeRequired")),
      endTime: z
        .string({
          error: t("recruitment.interviews.validation.endTimeRequired"),
        })
        .min(1, t("recruitment.interviews.validation.endTimeRequired")),
    })
    .superRefine((data, ctx) => {
      if (!data.startTime || !data.endTime) {
        return;
      }

      const scheduledTime = combineDateAndTime(data.date, data.startTime);
      const scheduledEndTime = combineDateAndTime(data.date, data.endTime);

      if (scheduledTime <= new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["startTime"],
          message: t("recruitment.interviews.validation.futureTimeRequired"),
        });
      }

      if (scheduledEndTime <= scheduledTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endTime"],
          message: t(
            "recruitment.interviews.validation.endTimeMustBeAfterStartTime",
          ),
        });
      }
    });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch interviewers to select from
  const { data: interviewers = [] } = useInterviewers();

  const { mutateAsync: createInterview } = useCreateInterview();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interviewerId: "",
      startTime: "",
      endTime: "",
    },
  });
  const selectedDate = form.watch("date");
  const selectedStartTime = form.watch("startTime");

  const isTodayOrNull =
    !selectedDate ||
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const currentTimeString = format(new Date(), "HH:mm");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const scheduledTime = combineDateAndTime(values.date, values.startTime);
      const endTime = combineDateAndTime(values.date, values.endTime);

      await createInterview({
        candidateId: candidate.id,
        jobId: candidate.appliedJobId,
        interviewerId: values.interviewerId,
        scheduledTime: scheduledTime,
        scheduledEndTime: endTime,
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
                      {interviewers.map((interviewer) => (
                        <SelectItem
                          key={interviewer.employeeId}
                          value={interviewer.employeeId}
                        >
                          {interviewer.firstName} {interviewer.lastName}
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
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {t("recruitment.interviews.date", "Date")}
                  </FormLabel>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
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
                            format(field.value, "PPP", {
                              locale: i18n.language === "zh-CN" ? zhCN : enUS,
                            })
                          ) : (
                            <span>{t("common.pickDate", "Pick a date")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date) =>
                          date < startOfToday() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      {t("recruitment.interviews.startTime", "Start Time")}
                    </FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        minTime={isTodayOrNull ? currentTimeString : undefined}
                        placeholder={t("common.startTime", "Select start time")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      {t("recruitment.interviews.endTime", "End Time")}
                    </FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        minTime={
                          selectedStartTime ||
                          (isTodayOrNull ? currentTimeString : undefined)
                        }
                        placeholder={t("common.endTime", "Select end time")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
