import { useState, useEffect, useMemo } from "react";
import type { JobPosition } from "@/types/job";
import { JobPositionList } from "./JobPositionList";
import { JobDialogs } from "./JobDialogs";
import type { JobFormValues } from "./forms/JobPositionForm";
import { useJobStore } from "@/stores/useJobStore";
import { useCandidateStore } from "@/stores/useCandidateStore";

/**
 * JobManagementTab component extracts the job-related logic and UI from RecruitmentPage.
 * It manages its own dialog state and uses useJobStore for job-related actions.
 */
export function JobManagementTab() {
  const { jobs, addJob, updateJob, deleteJob, toggleJobStatus, isAddDialogOpen, setIsAddDialogOpen, fetchJobs } = useJobStore();
  const { candidates, fetchCandidates } = useCandidateStore();

  const [editingJob, setEditingJob] = useState<JobPosition | undefined>(undefined);
  const [viewingJob, setViewingJob] = useState<JobPosition | undefined>(undefined);

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, [fetchJobs, fetchCandidates]);

  const jobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach((c) => {
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
      updateJob(editingJob.id, data);
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
