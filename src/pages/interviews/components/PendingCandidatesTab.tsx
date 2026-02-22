import { format } from "date-fns";
import { AlertCircle, FileText, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CandidateReviewDialog } from "@/components/interviews/CandidateReviewDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePendingResumes } from "@/hooks/queries/usePendingResumes";
import { Route } from "@/routes/_protected/pending-resumes";
import type { Candidate } from "@/types/candidate";

export function PendingCandidatesTab() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { reviewCandidateId } = Route.useSearch();
  const { data: candidates, isLoading, isError, error } = usePendingResumes();

  // Find the candidate selected for review
  const selectedCandidate =
    reviewCandidateId && candidates
      ? candidates.find((c) => c.id === reviewCandidateId)
      : null;

  const handleReviewClick = (candidateId: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        reviewCandidateId: candidateId,
      }),
    });
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      if (reviewCandidateId) {
        navigate({
          search: (prev) => ({ ...prev, reviewCandidateId: undefined }),
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("recruitment.candidates.pendingListTitle", "Candidates to Review")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {t("common.error.fetch", "Failed to fetch data")}
            </AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : t("header.retryLater", "Please try again later")}
            </AlertDescription>
          </Alert>
        ) : candidates && candidates.length > 0 ? (
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
                  {t("recruitment.candidates.detail.appliedAt", "Applied Date")}
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
                      variant="default"
                      size="sm"
                      onClick={() => handleReviewClick(candidate.id)}
                      className="cursor-pointer"
                    >
                      {t("recruitment.candidates.review", "Review")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <div className="bg-muted/30 p-4 rounded-full mb-4">
              <FileText className="h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              {t(
                "recruitment.candidates.noPendingResumes",
                "No pending resumes",
              )}
            </h3>
            <p className="text-sm max-w-xs mx-auto">
              {t(
                "recruitment.candidates.noPendingResumesDesc",
                "There are no candidates waiting for review at the moment.",
              )}
            </p>
          </div>
        )}
      </CardContent>

      {selectedCandidate && (
        <CandidateReviewDialog
          candidate={selectedCandidate as Candidate}
          open={!!selectedCandidate}
          onOpenChange={handleDialogClose}
        />
      )}
    </Card>
  );
}
