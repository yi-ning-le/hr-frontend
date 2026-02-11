import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCandidateCounts } from "@/hooks/queries/useCandidates";
import {
  useCreateJob,
  useDeleteJob,
  useJobs,
  useToggleJobStatus,
  useUpdateJob,
} from "@/hooks/queries/useJobs";
import { useJobStore } from "@/stores/useJobStore";
import type { JobPosition } from "@/types/job";
import type { JobFormValues } from "./forms/JobPositionForm";
import { JobDialogs } from "./JobDialogs";
import { JobPositionList } from "./JobPositionList";

/**
 * JobManagementTab component extracts the job-related logic and UI from RecruitmentPage.
 * It manages its own dialog state and uses useJobStore for job-related actions.
 */
export function JobManagementTab() {
  const { t } = useTranslation();
  const { isAddDialogOpen, setIsAddDialogOpen } = useJobStore();
  const { data: jobs = [] } = useJobs();
  const { data: jobCounts = {} } = useCandidateCounts();

  const { mutateAsync: addJob } = useCreateJob();
  const { mutateAsync: updateJob } = useUpdateJob();
  const { mutate: deleteJob } = useDeleteJob();
  const { mutate: toggleJobStatus } = useToggleJobStatus();

  const [editingJob, setEditingJob] = useState<JobPosition | undefined>(
    undefined,
  );
  const [viewingJob, setViewingJob] = useState<JobPosition | undefined>(
    undefined,
  );

  const handleEditJob = (job: JobPosition) => {
    setEditingJob(job);
    setIsAddDialogOpen(true);
  };

  const handleViewJob = (job: JobPosition) => {
    setViewingJob(job);
  };

  const handleDeleteJob = (jobId: string) => {
    deleteJob(jobId);
  };

  const handleStatusToggle = (job: JobPosition) => {
    toggleJobStatus(job.id);
  };

  const handleSaveJob = async (data: JobFormValues) => {
    try {
      if (editingJob) {
        await updateJob({ id: editingJob.id, data });
      } else {
        await addJob(data);
      }
      setIsAddDialogOpen(false);
    } catch {
      toast.error(
        t("recruitment.jobs.messages.saveFailed", "Failed to save job"),
      );
    }
  };

  return (
    <>
      <JobPositionList
        jobs={jobs}
        candidateCounts={jobCounts}
        onEdit={handleEditJob}
        onDelete={handleDeleteJob}
        onView={handleViewJob}
        onStatusToggle={handleStatusToggle}
      />

      <JobDialogs
        isDialogOpen={isAddDialogOpen}
        setIsDialogOpen={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingJob(undefined);
        }}
        editingJob={editingJob}
        handleSaveJob={handleSaveJob}
        viewingJob={viewingJob}
        setViewingJob={setViewingJob}
      />
    </>
  );
}
