import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobStore } from "@/stores/useJobStore";
import { Loader2 } from "lucide-react";


const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  education: z.string().min(2, "Education is required"),
  experienceYears: z.coerce.number().min(0, "Experience must be a positive number"),
  channel: z.string().min(1, "Please select a channel"),
  note: z.string().default(""),
  // Hidden/Auto fields
  appliedJobId: z.string().min(1, "Please select a position"),
  appliedJobTitle: z.string().default("General Application"),
  status: z.enum(["new", "screening", "interview", "offer", "hired", "rejected"]).default("new"),
  resumeUrl: z.string().default("#"),
  appliedAt: z.date().default(() => new Date()),
});

export type CandidateFormValues = z.infer<typeof candidateSchema>;

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
  submitLabel = "Save",
  hideNote = false,
}: CandidateFormProps) {
  const { jobs, fetchJobs, isLoading: isLoadingJobs } = useJobStore();

  useEffect(() => {
    if (jobs.length === 0) {
      fetchJobs();
    }
  }, [jobs.length, fetchJobs]);

  const form = useForm<CandidateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(candidateSchema) as any,
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 234 567 890" {...field} />
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
                <FormLabel>Channel</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Official Site">Official Site</SelectItem>
                    <SelectItem value="Hunter">Headhunter</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
                <FormLabel>Applying Position</FormLabel>
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
                          <span>Loading jobs...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select position" />
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
                <FormLabel>Education</FormLabel>
                <FormControl>
                  <Input placeholder="Degree, University" {...field} />
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
                <FormLabel>Experience (Years)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
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
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add a note..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
}
