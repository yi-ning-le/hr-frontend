import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReviewCandidateDialog } from "@/components/interviews/ReviewCandidateDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePendingResumes } from "@/hooks/queries/usePendingResumes";
import { CandidateInfoSection } from "@/pages/recruitment/components/candidates/detail/CandidateInfoSection";
import { CandidateResumeSection } from "@/pages/recruitment/components/candidates/detail/CandidateResumeSection";
import { ResumePreviewModal } from "@/pages/recruitment/components/candidates/ResumePreviewModal";
import type { Candidate } from "@/types/candidate";

function CandidateViewDialog({
  candidate,
  open,
  onOpenChange,
}: {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
          <DialogHeader className="p-6 border-b shrink-0">
            <DialogTitle>{candidate.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6">
            <div className="grid gap-8 pb-20">
              <CandidateInfoSection candidate={candidate} />
              <Separator />
              <CandidateResumeSection
                candidate={candidate}
                isUploadingResume={false}
                onResumeUpload={() => {}}
                onPreviewClick={() => setIsPreviewOpen(true)}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <ResumePreviewModal
        candidate={candidate}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
}

export default function PendingResumesPage() {
  const { t } = useTranslation();
  const { data: candidates, isLoading } = usePendingResumes();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null);

  const handleReview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsReviewOpen(true);
  };

  const handleView = (candidate: Candidate) => {
    setViewCandidate(candidate);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("nav.pendingResumes", "Pending Resumes")}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t(
              "recruitment.candidates.pendingListTitle",
              "Candidates to Review",
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {candidates && candidates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t("recruitment.candidates.name", "Name")}
                  </TableHead>
                  <TableHead>
                    {t("recruitment.candidates.position", "Position")}
                  </TableHead>
                  <TableHead>
                    {t("recruitment.candidates.experience", "Experience")}
                  </TableHead>
                  <TableHead>
                    {t(
                      "recruitment.candidates.detail.appliedAt",
                      "Applied Date",
                    )}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("common.actions", "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">
                      {candidate.name}
                    </TableCell>
                    <TableCell>{candidate.appliedJobTitle}</TableCell>
                    <TableCell>
                      {candidate.experienceYears} {t("common.years", "years")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(candidate.appliedAt), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(candidate)}
                        className="cursor-pointer"
                      >
                        {t("common.view", "View")}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleReview(candidate)}
                      >
                        {t("recruitment.candidates.review", "Review")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              {t(
                "recruitment.candidates.noPendingResumes",
                "No pending resumes to review.",
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCandidate && (
        <ReviewCandidateDialog
          candidate={selectedCandidate}
          open={isReviewOpen}
          onOpenChange={setIsReviewOpen}
        />
      )}

      {viewCandidate && (
        <CandidateViewDialog
          candidate={viewCandidate}
          open={!!viewCandidate}
          onOpenChange={(open) => !open && setViewCandidate(null)}
        />
      )}
    </div>
  );
}
