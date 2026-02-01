"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import type { JobPosition } from "@/types/job"
import { JobBasicInfoFields } from "./JobBasicInfoFields"
import { JobDateStatusFields } from "./JobDateStatusFields"
import { JobDescriptionFields } from "./JobDescriptionFields"

const jobFormSchema = z.object({
  title: z.string().min(2, {
    message: "职位名称至少需要2个字符",
  }),
  department: z.string().min(1, {
    message: "请选择或输入部门",
  }),
  headCount: z.coerce.number().min(1, {
    message: "招聘人数至少为1人",
  }),
  openDate: z.date(),
  jobDescription: z.string().min(10, {
    message: "职位描述至少需要10个字符",
  }),
  note: z.string().optional(),
  status: z.enum(["OPEN", "CLOSED"]).default("OPEN"),
})

export interface JobFormValues {
  title: string
  department: string
  headCount: number
  openDate: Date
  jobDescription: string
  note?: string
  status: "OPEN" | "CLOSED"
}

interface JobPositionFormProps {
  initialData?: JobPosition
  onSubmit: (data: JobFormValues) => void
  onCancel?: () => void
  className?: string
}

export function JobPositionForm({ initialData, onSubmit, onCancel, className }: JobPositionFormProps) {
  const form = useForm<JobFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(jobFormSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      department: initialData?.department || "",
      headCount: initialData?.headCount || 1,
      openDate: initialData?.openDate as Date,
      jobDescription: initialData?.jobDescription || "",
      note: initialData?.note || "",
      status: initialData?.status || "OPEN",
    },
  })

  function handleSubmit(data: JobFormValues) {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("flex flex-col h-full", className)}>
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 p-1">
          <JobBasicInfoFields control={form.control} />
          <JobDateStatusFields control={form.control} />
          <JobDescriptionFields control={form.control} />
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t mt-auto">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel}>
              取消
            </Button>
          )}
          <Button type="submit">保存职位</Button>
        </div>
      </form>
    </Form>
  )
}
