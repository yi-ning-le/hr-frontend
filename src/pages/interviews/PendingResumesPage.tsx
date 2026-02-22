import { format } from "date-fns";
import { AlertCircle, FileText, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CandidateReviewDialog } from "@/components/interviews/CandidateReviewDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Route } from "@/routes/_protected/pending-resumes";
import type { Candidate } from "@/types/candidate";

type CandidateTab = "pending" | "reviewed";

export default function PendingResumesPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { reviewCandidateId, tab } = Route.useSearch();
  const activeTab: CandidateTab = tab === "reviewed" ? "reviewed" : "pending";
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

  const getCandidateReviewStatus = useCallback(
    (candidate: Candidate) => candidate.reviewStatus || candidate.status,
    [],
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "suitable":
        return t("candidate.suitable", "Suitable");
      case "unsuitable":
        return t("candidate.unsuitable", "Unsuitable");
      case "new":
        return t("recruitment.candidates.statusOptions.new", "New");
      case "screening":
        return t("recruitment.candidates.statusOptions.screening", "Screening");
      case "interview":
        return t(
          "recruitment.candidates.statusOptions.interview",
          "Interviewing",
        );
      case "offer":
        return t("recruitment.candidates.statusOptions.offer", "Offered");
      case "hired":
        return t("recruitment.candidates.statusOptions.hired", "Hired");
      case "rejected":
        return t("recruitment.candidates.statusOptions.rejected", "Rejected");
      default:
        return status;
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReviewedCandidates = useMemo(() => {
    if (!reviewedCandidates) return [];
    let filtered = reviewedCandidates;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.appliedJobTitle.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (candidate) => getCandidateReviewStatus(candidate) === statusFilter,
      );
    }

    return filtered;
  }, [reviewedCandidates, searchQuery, statusFilter, getCandidateReviewStatus]);

  const reviewStatusOptions = useMemo(() => {
    if (!reviewedCandidates) return [];
    const statuses = new Set(reviewedCandidates.map(getCandidateReviewStatus));
    return Array.from(statuses).filter(Boolean);
  }, [reviewedCandidates, getCandidateReviewStatus]);

  const handleReview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleTabChange = (value: string) => {
    const nextTab: CandidateTab = value === "reviewed" ? "reviewed" : "pending";
    navigate({
      search: (prev) => ({ ...prev, tab: nextTab }),
    });
  };

  useEffect(() => {
    if (reviewCandidateId && candidates && candidates.length > 0) {
      const candidateToReview = candidates.find(
        (c) => c.id === reviewCandidateId,
      );
      if (candidateToReview) {
        setSelectedCandidate(candidateToReview);
        navigate({
          search: (prev) => ({
            ...prev,
            tab: "pending",
          }),
        });
      }
    }
  }, [reviewCandidateId, candidates, navigate]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("nav.pendingResumes", "Pending Resumes")}
        </h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
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
              {/* Search & Filter Bar */}
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t(
                      "recruitment.candidates.searchPlaceholder",
                      "Search by name or position...",
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  aria-label={t(
                    "candidate.reviewStatusFilter",
                    "Filter by review status",
                  )}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm bg-background"
                >
                  <option value="all">{t("common.all", "All")}</option>
                  {reviewStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

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
              ) : filteredReviewedCandidates.length > 0 ? (
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
                      <TableHead>
                        {t("candidate.reviewTime", "Review Time")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviewedCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">
                          {candidate.name}
                        </TableCell>
                        <TableCell>{candidate.appliedJobTitle}</TableCell>
                        <TableCell>
                          {getStatusLabel(getCandidateReviewStatus(candidate))}
                        </TableCell>
                        <TableCell>
                          {format(new Date(candidate.appliedAt), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell>
                          {candidate.reviewedAt
                            ? format(
                                new Date(candidate.reviewedAt),
                                "yyyy-MM-dd HH:mm",
                              )
                            : "-"}
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
              if (reviewCandidateId) {
                navigate({
                  search: (prev) => ({ ...prev, reviewCandidateId: undefined }),
                });
              }
            }
          }}
        />
      )}
    </div>
  );
}
