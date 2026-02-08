import { useMemo, useState } from "react";
import { useCandidates } from "@/hooks/queries/useCandidates";
import {
  useCreateJob,
  useDeleteJob,
  useJobs,
  useToggleJobStatus,
  useUpdateJob,
} from "@/hooks/queries/useJobs";
import { useJobStore } from "@/stores/useJobStore";
import type { Candidate } from "@/types/candidate";
import type { JobPosition } from "@/types/job";
import type { JobFormValues } from "./forms/JobPositionForm";
import { JobDialogs } from "./JobDialogs";
import { JobPositionList } from "./JobPositionList";

/**
 * JobManagementTab component extracts the job-related logic and UI from RecruitmentPage.
 * It manages its own dialog state and uses useJobStore for job-related actions.
 */
export function JobManagementTab() {
  const { isAddDialogOpen, setIsAddDialogOpen } = useJobStore();
  const { data: jobs = [] } = useJobs();
  const { data: candidates = [] } = useCandidates();

  const { mutate: addJob } = useCreateJob();
  const { mutate: updateJob } = useUpdateJob();
  const { mutate: deleteJob } = useDeleteJob();
  const { mutate: toggleJobStatus } = useToggleJobStatus();

  const [editingJob, setEditingJob] = useState<JobPosition | undefined>(
    undefined,
  );
  const [viewingJob, setViewingJob] = useState<JobPosition | undefined>(
    undefined,
  );

  const jobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach((c: Candidate) => {
      counts[c.appliedJobId] = (counts[c.appliedJobId] || 0) + 1;
    });
    return counts;
  }, [candidates]);

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

  const handleSaveJob = (data: JobFormValues) => {
    if (editingJob) {
      updateJob({ id: editingJob.id, data });
    } else {
      addJob(data);
    }
    setIsAddDialogOpen(false);
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
