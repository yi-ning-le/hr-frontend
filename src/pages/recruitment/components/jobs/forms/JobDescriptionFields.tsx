import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { JobFormValues } from "./JobPositionForm";

interface JobDescriptionFieldsProps {
  control: Control<JobFormValues>;
}

export function JobDescriptionFields({ control }: JobDescriptionFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={control}
        name="jobDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("recruitment.jobs.form.jdLabel")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("recruitment.jobs.form.jdPlaceholder")}
                className="min-h-[200px] resize-y"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("recruitment.jobs.form.noteLabel")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("recruitment.jobs.form.notePlaceholder")}
                className="min-h-[80px] resize-y"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
