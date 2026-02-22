import { format } from "date-fns";
import { AlertCircle, ClipboardList, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CandidateActivityTimeline } from "@/components/candidates/CandidateActivityTimeline";
import { CandidateReviewDialog } from "@/components/interviews/CandidateReviewDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePendingResumes } from "@/hooks/queries/usePendingResumes";
import { useReviewedCandidates } from "@/hooks/queries/useReviewedCandidates";
import type { Candidate } from "@/types/candidate";

type CandidateTab = "pending" | "reviewed";

export default function PendingResumesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<CandidateTab>("pending");
  const {
    data: candidates,
    isLoading,
    isError: isPendingError,
    error: pendingError,
  } = usePendingResumes();
  const {
    data: reviewedCandidates,
    isLoading: isLoadingReviewed,
    isError: isReviewedError,
    error: reviewedError,
  } = useReviewedCandidates(activeTab === "reviewed");

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );

  const [historyCandidateId, setHistoryCandidateId] = useState<string | null>(
    null,
  );

  const handleReview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleViewHistory = (candidateId: string) => {
    setHistoryCandidateId(candidateId);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("nav.pendingResumes", "Pending Resumes")}
        </h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as CandidateTab)}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="pending" className="px-8">
            {t(
              "recruitment.candidates.pendingListTitle",
              "Candidates to Review",
            )}
          </TabsTrigger>
          <TabsTrigger value="reviewed" className="px-8">
            {t("recruitment.candidates.reviewedListTitle", "Reviewed History")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
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
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : isPendingError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {t("common.error.fetch", "Failed to fetch data")}
                  </AlertTitle>
                  <AlertDescription>
                    {pendingError instanceof Error
                      ? pendingError.message
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
                          {candidate.experienceYears}{" "}
                          {t("common.years", "years")}
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
          </Card>
        </TabsContent>

        <TabsContent value="reviewed">
          <Card>
            <CardHeader>
              <CardTitle>
                {t(
                  "recruitment.candidates.reviewedListTitle",
                  "Reviewed History",
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingReviewed ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : isReviewedError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {t("common.error.fetch", "Failed to fetch data")}
                  </AlertTitle>
                  <AlertDescription>
                    {reviewedError instanceof Error
                      ? reviewedError.message
                      : t("header.retryLater", "Please try again later")}
                  </AlertDescription>
                </Alert>
              ) : reviewedCandidates && reviewedCandidates.length > 0 ? (
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
                        {t("candidate.reviewStatus", "Review Status")}
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
                    {reviewedCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">
                          {candidate.name}
                        </TableCell>
                        <TableCell>{candidate.appliedJobTitle}</TableCell>
                        <TableCell>
                          {candidate.reviewStatus || candidate.status}
                        </TableCell>
                        <TableCell>
                          {format(new Date(candidate.appliedAt), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewHistory(candidate.id)}
                            className="cursor-pointer"
                          >
                            {t("common.viewHistory", "View History")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <div className="bg-muted/30 p-4 rounded-full mb-4">
                    <ClipboardList className="h-8 w-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    {t("recruitment.candidates.noHistory", "No history found")}
                  </h3>
                  <p className="text-sm max-w-xs mx-auto">
                    {t(
                      "recruitment.candidates.noHistoryDesc",
                      "You haven't reviewed any candidates yet.",
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

      {historyCandidateId && (
        <Dialog
          open={!!historyCandidateId}
          onOpenChange={(open) => !open && setHistoryCandidateId(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {t(
                  "recruitment.candidates.history.title",
                  "Processing History",
                )}
              </DialogTitle>
            </DialogHeader>
            <CandidateActivityTimeline candidateId={historyCandidateId} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
