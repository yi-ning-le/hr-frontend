import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { type Resolver, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useJobs } from "@/hooks/queries/useJobs";
import { useCandidateStatuses } from "@/hooks/useCandidateStatuses";
import type { CandidateStatusDefinition as CandidateStatus } from "@/types/candidate";

const createCandidateSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("recruitment.candidates.form.validation.nameMin")),
    email: z.email(t("recruitment.candidates.form.validation.emailInvalid")),
    phone: z
      .string()
      .min(10, t("recruitment.candidates.form.validation.phoneMin")),
    education: z
      .string()
      .min(2, t("recruitment.candidates.form.validation.educationRequired")),
    experienceYears: z.coerce
      .number()
      .min(0, t("recruitment.candidates.form.validation.experiencePositive")),
    channel: z
      .string()
      .min(1, t("recruitment.candidates.form.validation.channelRequired")),
    note: z.string().default(""),
    // Hidden/Auto fields
    appliedJobId: z
      .string()
      .min(1, t("recruitment.candidates.form.validation.positionRequired")),
    appliedJobTitle: z.string().default("General Application"),
    status: z.string().default("new"),
    resumeUrl: z.string().default("#"),
    appliedAt: z.date().default(() => new Date()),
  });

export type CandidateFormValues = z.infer<
  ReturnType<typeof createCandidateSchema>
>;

interface CandidateFormProps {
  defaultValues?: Partial<CandidateFormValues>;
  onSubmit: (data: CandidateFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
  hideNote?: boolean;
}

export function CandidateForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
  hideNote = false,
}: CandidateFormProps) {
  const { t } = useTranslation();
  const { data: jobs = [], isLoading: isLoadingJobs } = useJobs();
  const { statuses } = useCandidateStatuses();

  const candidateSchema = createCandidateSchema(t);

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema) as Resolver<CandidateFormValues>,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      education: "",
      experienceYears: 0,
      channel: "",
      note: "",
      appliedJobId: "",
      appliedJobTitle: "",
      ...defaultValues,
    },
  });

  // Update appliedJobTitle when appliedJobId changes
  const selectedJobId = useWatch({
    control: form.control,
    name: "appliedJobId",
  });
  useEffect(() => {
    const selectedJob = jobs.find((job) => job.id === selectedJobId);
    if (selectedJob) {
      form.setValue("appliedJobTitle", selectedJob.title);
    }
  }, [selectedJobId, jobs, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recruitment.candidates.name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      "recruitment.candidates.form.namePlaceholder",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recruitment.candidates.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      "recruitment.candidates.form.emailPlaceholder",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recruitment.candidates.phone")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      "recruitment.candidates.form.phonePlaceholder",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recruitment.candidates.channel")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "recruitment.candidates.form.selectChannel",
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LinkedIn">
                      {t("recruitment.candidates.form.channels.linkedin")}
                    </SelectItem>
                    <SelectItem value="Referral">
                      {t("recruitment.candidates.form.channels.referral")}
                    </SelectItem>
                    <SelectItem value="Official Site">
                      {t("recruitment.candidates.form.channels.official")}
                    </SelectItem>
                    <SelectItem value="Hunter">
                      {t("recruitment.candidates.form.channels.headhunter")}
                    </SelectItem>
                    <SelectItem value="Other">
                      {t("recruitment.candidates.form.channels.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="appliedJobId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recruitment.candidates.position")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isLoadingJobs}
                >
                  <FormControl>
                    <SelectTrigger>
                      {isLoadingJobs ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>
                            {t("recruitment.candidates.form.loadingJobs")}
                          </span>
                        </div>
                      ) : (
                        <SelectValue
                          placeholder={t(
                            "recruitment.candidates.form.selectPosition",
                          )}
                        />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} ({job.department})
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
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recruitment.candidates.education")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      "recruitment.candidates.form.educationPlaceholder",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="experienceYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("recruitment.candidates.experienceYears")}
                </FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status field - usually hidden on create but useful if editing */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recruitment.candidates.status")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status: CandidateStatus) => (
                      <SelectItem key={status.slug} value={status.slug}>
                        {status.type === "system"
                          ? t(
                              `recruitment.candidates.statusOptions.${status.slug}`,
                              status.name,
                            )
                          : status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!hideNote && (
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recruitment.candidates.note")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t(
                      "recruitment.candidates.form.notePlaceholder",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("common.cancel")}
            </Button>
          )}
          <Button type="submit">{submitLabel || t("common.save")}</Button>
        </div>
      </form>
    </Form>
  );
}
