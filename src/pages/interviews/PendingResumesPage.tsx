import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CandidateReviewDialog } from "@/components/interviews/CandidateReviewDialog";
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
import type { Candidate } from "@/types/candidate";

export default function PendingResumesPage() {
  const { t } = useTranslation();
  const { data: candidates, isLoading } = usePendingResumes();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );

  const handleReview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
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
                        variant="default"
                        size="sm"
                        onClick={() => handleReview(candidate)}
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
        <CandidateReviewDialog
          candidate={selectedCandidate}
          open={!!selectedCandidate}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedCandidate(null);
            }
          }}
        />
      )}
    </div>
  );
}
