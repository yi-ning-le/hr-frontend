import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobPositionForm, type JobFormValues } from "./forms/JobPositionForm";
import { JobPositionDetail } from "./JobPositionDetail";
import type { JobPosition } from "@/types/job";

interface JobDialogsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingJob: JobPosition | undefined;
  handleSaveJob: (data: JobFormValues) => void;
  viewingJob: JobPosition | undefined;
  setViewingJob: (job: JobPosition | undefined) => void;
}

export function JobDialogs({
  isDialogOpen,
  setIsDialogOpen,
  editingJob,
  handleSaveJob,
  viewingJob,
  setViewingJob,
}: JobDialogsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col" aria-describedby="job-description-content">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              {editingJob
                ? t("recruitment.jobs.dialog.editTitle")
                : t("recruitment.jobs.dialog.addTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("recruitment.jobs.dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-hidden">
            <JobPositionForm
              className="h-full"
              initialData={editingJob}
              onSubmit={handleSaveJob}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingJob} onOpenChange={(open) => !open && setViewingJob(undefined)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{viewingJob?.title}</DialogTitle>
            <DialogDescription>
              {t("recruitment.jobs.dialog.detailTitle")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden px-1 min-h-0">
            {viewingJob && <JobPositionDetail job={viewingJob} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
