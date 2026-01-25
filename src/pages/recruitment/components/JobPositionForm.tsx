"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Maximize2 } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { JobPosition } from "@/types/job"

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

export type JobFormValues = z.infer<typeof jobFormSchema>

interface JobPositionFormProps {
  initialData?: JobPosition
  onSubmit: (data: JobFormValues) => void
  onCancel?: () => void
}

interface ExpandableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title: string;
  className?: string;
}

function ExpandableTextarea({
  value,
  onChange,
  placeholder,
  title,
  className
}: ExpandableTextareaProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <FormLabel>{title}</FormLabel>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsFullScreen(true)}
          title="全屏编辑"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <FormControl>
        <Textarea
          placeholder={placeholder}
          className={cn("resize-none", className)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormControl>

      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>编辑{title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-1">
            <Textarea
              className="min-h-full resize-none border-0 focus-visible:ring-0 text-base"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setIsFullScreen(false)}>完成</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function JobPositionForm({ initialData, onSubmit, onCancel, className }: JobPositionFormProps & { className?: string }) {
  const form = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      department: initialData?.department || "",
      headCount: initialData?.headCount || 1,
      openDate: initialData?.openDate,
      jobDescription: initialData?.jobDescription || "",
      note: initialData?.note || "",
      status: initialData?.status || "OPEN",
    },
  })

  function handleSubmit(data: z.infer<typeof jobFormSchema>) {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("flex flex-col h-full", className)}>
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 p-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>职位名称</FormLabel>
                <FormControl>
                  <Input placeholder="例如：高级前端工程师" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用人部门</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：研发部" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>需求人数</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} value={field.value as number} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="openDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>启动日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>选择日期</span>
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
                          date < new Date("1900-01-01")
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>状态</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPEN">招聘中 (Open)</SelectItem>
                      <SelectItem value="CLOSED">已关闭 (Closed)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <ExpandableTextarea
                  value={field.value || ''}
                  onChange={field.onChange}
                  title="职位描述 (JD)"
                  placeholder="请输入职位职责和要求..."
                  className="h-[200px]"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <ExpandableTextarea
                  value={field.value || ''}
                  onChange={field.onChange}
                  title="备注"
                  placeholder="仅内部可见的备注信息..."
                  className="h-[80px]"
                />
                <FormMessage />
              </FormItem>
            )}
          />
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
