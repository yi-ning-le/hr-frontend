"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { JobPosition } from "@/types/job";
import { JobBasicInfoFields } from "./JobBasicInfoFields";
import { JobDateStatusFields } from "./JobDateStatusFields";
import { JobDescriptionFields } from "./JobDescriptionFields";

export interface JobFormValues {
  title: string;
  department: string;
  headCount: number;
  openDate: Date;
  jobDescription: string;
  note?: string;
  status: "OPEN" | "CLOSED";
}

interface JobPositionFormProps {
  initialData?: JobPosition;
  onSubmit: (data: JobFormValues) => void;
  onCancel?: () => void;
  className?: string;
}

export function JobPositionForm({
  initialData,
  onSubmit,
  onCancel,
  className,
}: JobPositionFormProps) {
  const { t } = useTranslation();

  const jobFormSchema = useMemo(
    () =>
      z.object({
        title: z.string().min(2, {
          message: t("recruitment.jobs.form.validation.titleMin"),
        }),
        department: z.string().min(1, {
          message: t("recruitment.jobs.form.validation.departmentRequired"),
        }),
        headCount: z.coerce.number().min(1, {
          message: t("recruitment.jobs.form.validation.headCountMin"),
        }),
        openDate: z.date(),
        jobDescription: z.string().min(10, {
          message: t("recruitment.jobs.form.validation.jdMin"),
        }),
        note: z.string().optional(),
        status: z.enum(["OPEN", "CLOSED"]).default("OPEN"),
      }),
    [t],
  );

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema) as Resolver<JobFormValues>,
    defaultValues: {
      title: initialData?.title || "",
      department: initialData?.department || "",
      headCount: initialData?.headCount || 1,
      openDate: initialData?.openDate as Date,
      jobDescription: initialData?.jobDescription || "",
      note: initialData?.note || "",
      status: initialData?.status || "OPEN",
    },
  });

  function handleSubmit(data: JobFormValues) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("flex flex-col h-full", className)}
      >
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 p-1">
          <JobBasicInfoFields control={form.control} />
          <JobDateStatusFields control={form.control} />
          <JobDescriptionFields control={form.control} />
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t mt-auto">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel}>
              {t("recruitment.jobs.form.cancel")}
            </Button>
          )}
          <Button type="submit">{t("recruitment.jobs.form.save")}</Button>
        </div>
      </form>
    </Form>
  );
}
