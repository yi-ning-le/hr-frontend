import { useTranslation } from "react-i18next"
import type { Control } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { ExpandableTextarea } from "./ExpandableTextarea"
import type { JobFormValues } from "./JobPositionForm"

interface JobDescriptionFieldsProps {
  control: Control<JobFormValues>
}

export function JobDescriptionFields({ control }: JobDescriptionFieldsProps) {
  const { t } = useTranslation()

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
              title={t("recruitment.jobs.form.jdLabel")}
              placeholder={t("recruitment.jobs.form.jdPlaceholder")}
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
              title={t("recruitment.jobs.form.noteLabel")}
              placeholder={t("recruitment.jobs.form.notePlaceholder")}
              className="h-[80px]"
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
