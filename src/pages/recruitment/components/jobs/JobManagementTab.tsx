import { useState } from "react";
import type { JobPosition } from "@/types/job";
import { JobPositionList } from "./JobPositionList";
import { JobDialogs } from "./JobDialogs";
import { useJobStore } from "@/stores/useJobStore";

/**
 * JobManagementTab component extracts the job-related logic and UI from RecruitmentPage.
 * It manages its own dialog state and uses useJobStore for job-related actions.
 */
export function JobManagementTab() {
  const { jobs, addJob, updateJob, deleteJob, toggleJobStatus, isAddDialogOpen, setIsAddDialogOpen } = useJobStore();

  const [editingJob, setEditingJob] = useState<JobPosition | undefined>(undefined);
  const [viewingJob, setViewingJob] = useState<JobPosition | undefined>(undefined);

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

  const handleSaveJob = (data: any) => { // data is JobFormValues
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
