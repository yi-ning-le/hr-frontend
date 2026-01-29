import type { Control } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { ExpandableTextarea } from "./ExpandableTextarea"
import type { JobFormValues } from "../JobPositionForm"

interface JobDescriptionFieldsProps {
  control: Control<JobFormValues>
}

export function JobDescriptionFields({ control }: JobDescriptionFieldsProps) {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
    </>
  )
}
