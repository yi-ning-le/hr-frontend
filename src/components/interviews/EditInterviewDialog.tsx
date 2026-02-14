import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { enUS, zhCN } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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

import { useEmployees } from "@/hooks/queries/useEmployees";
import { useUpdateInterview } from "@/hooks/queries/useInterviews";
import { cn } from "@/lib/utils";
import type { Interview } from "@/types/recruitment.d";

interface EditInterviewDialogProps {
  interview: Interview;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const combineDateAndTime = (date: Date, timeSlot: string) => {
  return parse(timeSlot, "HH:mm", date);
};

export function EditInterviewDialog({
  interview,
  open,
  onOpenChange,
}: EditInterviewDialogProps) {
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

  const { data: employeeData } = useEmployees({ limit: 100, status: "Active" });
  const employees = employeeData?.employees || [];

  const { mutateAsync: updateInterview, isPending: isSubmitting } =
    useUpdateInterview();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interviewerId: interview.interviewerId,
      date: new Date(interview.scheduledTime),
      startTime: format(new Date(interview.scheduledTime), "HH:mm"),
      endTime: format(new Date(interview.scheduledEndTime), "HH:mm"),
    },
  });

  // Reset form when interview changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        interviewerId: interview.interviewerId,
        date: new Date(interview.scheduledTime),
        startTime: format(new Date(interview.scheduledTime), "HH:mm"),
        endTime: format(new Date(interview.scheduledEndTime), "HH:mm"),
      });
    }
  }, [open, interview, form]);

  const selectedStartTime = form.watch("startTime");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const scheduledTime = combineDateAndTime(values.date, values.startTime);
      const endTime = combineDateAndTime(values.date, values.endTime);

      await updateInterview({
        id: interview.id,
        data: {
          interviewerId: values.interviewerId,
          scheduledTime: scheduledTime,
          scheduledEndTime: endTime,
        },
      });

      toast.success(t("common.updateSuccess", "Update Successful"));
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(t("common.updateFailed", "Update Failed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("recruitment.interviews.editTitle", "Edit Interview")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "recruitment.interviews.editDescription",
              "Update interview schedule and interviewer.",
            )}
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
                        minTime={selectedStartTime}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("common.save", "Save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
