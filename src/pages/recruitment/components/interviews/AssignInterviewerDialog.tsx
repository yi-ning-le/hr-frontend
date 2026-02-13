import { zodResolver } from "@hookform/resolvers/zod";
import { format, isSameDay, startOfToday } from "date-fns";
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

import { useEmployees } from "@/hooks/queries/useEmployees";
import { useCreateInterview } from "@/hooks/queries/useInterviews";
import { cn } from "@/lib/utils";
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
    scheduledTime: z
      .date({
        message: t("recruitment.interviews.validation.scheduledTimeRequired"),
      })
      .refine(
        (date) => {
          return date >= new Date();
        },
        {
          message: t("recruitment.interviews.validation.futureTimeRequired"),
        },
      ),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch employees to select from
  const { data: employeeData } = useEmployees({ limit: 100, status: "Active" }); // Simple fetch, maybe need search later
  const employees = employeeData?.employees || [];

  // Generate time slots (every 30 minutes)
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const { mutateAsync: createInterview } = useCreateInterview();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interviewerId: "",
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
        // Don't save notes to interview object, save as comment instead
        notes: "",
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
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal flex-1",
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
                          onSelect={(date) => {
                            if (!date) return;
                            const newDate = new Date(date);
                            const now = new Date();
                            if (field.value) {
                              newDate.setHours(
                                field.value.getHours(),
                                field.value.getMinutes(),
                              );
                            } else {
                              // If selecting today, default to current time + 1 hour (or next hour mark)
                              // If selecting future date, default to 9:00
                              if (isSameDay(newDate, now)) {
                                newDate.setHours(now.getHours() + 1, 0);
                              } else {
                                newDate.setHours(9, 0);
                              }
                            }
                            // Ensure we don't set a time in the past if it's today
                            if (newDate < now) {
                              newDate.setHours(now.getHours() + 1, 0);
                            }
                            field.onChange(newDate);
                          }}
                          disabled={(date) =>
                            date < startOfToday() ||
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Select
                      value={
                        field.value ? format(field.value, "HH:mm") : undefined
                      }
                      onValueChange={(time) => {
                        if (!time) return;
                        const [hours, minutes] = time.split(":").map(Number);
                        const newDate = field.value
                          ? new Date(field.value)
                          : startOfToday();
                        newDate.setHours(hours, minutes);

                        // If it's today, prevent setting past time
                        const now = new Date();
                        if (isSameDay(newDate, now) && newDate < now) {
                          newDate.setHours(now.getHours(), now.getMinutes());
                        }

                        field.onChange(newDate);
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder={t("common.time")} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {timeSlots.map((time) => {
                          const [hours, minutes] = time.split(":").map(Number);
                          // Ensure field.value exists, if not use today
                          const dateBase = field.value || new Date();
                          const isToday = isSameDay(dateBase, new Date());
                          const now = new Date();
                          let isDisabled = false;

                          if (isToday) {
                            const timeDate = new Date(dateBase);
                            timeDate.setHours(hours, minutes);
                            isDisabled = timeDate < now;
                          }

                          return (
                            <SelectItem
                              key={time}
                              value={time}
                              disabled={isDisabled}
                              className={
                                isDisabled
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }
                            >
                              {time}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
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
