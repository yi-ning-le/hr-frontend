import { useTranslation } from "react-i18next"
import type { Control } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { JobFormValues } from "./JobPositionForm"

interface JobBasicInfoFieldsProps {
  control: Control<JobFormValues>
}

export function JobBasicInfoFields({ control }: JobBasicInfoFieldsProps) {
  const { t } = useTranslation()

  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("recruitment.jobs.form.titleLabel")}</FormLabel>
            <FormControl>
              <Input placeholder={t("recruitment.jobs.form.titlePlaceholder")} {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("recruitment.jobs.form.departmentLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("recruitment.jobs.form.departmentPlaceholder")} {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="headCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("recruitment.jobs.form.headCountLabel")}</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} value={field.value as number} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
