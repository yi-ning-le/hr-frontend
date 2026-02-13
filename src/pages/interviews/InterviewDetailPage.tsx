import { Link, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  MapPin,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CandidateCommentsSection } from "@/components/candidates/comments/CandidateCommentsSection";
import { ResumePreviewModal } from "@/components/candidates/ResumePreviewModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidate } from "@/hooks/queries/useCandidates";
import { useInterview } from "@/hooks/queries/useInterviews";

export function InterviewDetailPage() {
  const { interviewId } = useParams({
    from: "/_protected/interviews/$interviewId",
  });
  const { t } = useTranslation();
  const { data: interview, isLoading: isLoadingInterview } =
    useInterview(interviewId);
  const candidateId = interview?.candidateId ?? "";
  const { data: candidate, isLoading: isLoadingCandidate } =
    useCandidate(candidateId);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (isLoadingInterview || (!!candidateId && isLoadingCandidate)) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!interview) {
    return <div>{t("common.notFound")}</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/my-interviews"
          search={{ viewMode: "list" }}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("recruitment.interviews.backToMyInterviews")}
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {t("recruitment.interviews.interviewDetails")}
            <Badge
              variant={
                interview.status === "PENDING"
                  ? "default"
                  : interview.status === "COMPLETED"
                    ? "secondary"
                    : "destructive"
              }
              className="text-base px-3 py-1"
            >
              {t(`recruitment.interviews.status.${interview.status}`)}
            </Badge>
          </h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("recruitment.interviews.interviewNotes")}
              </CardTitle>
              <CardDescription>
                {t("recruitment.interviews.notesDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              <CandidateCommentsSection
                candidateId={candidateId}
                className="flex-1 border-t-0"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Candidate Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("recruitment.candidates.detail.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {t("common.name")}
                  </div>
                  <div className="text-lg font-semibold">
                    {candidate?.name || t("common.unknown")}
                  </div>
                </div>
                {candidate?.resumeUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewOpen(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {t(
                      "recruitment.candidates.detail.viewResume",
                      "View Resume",
                    )}
                  </Button>
                )}
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {t("recruitment.jobs.title")}
                </div>
                <div>{candidate?.appliedJobTitle}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {t("common.contact")}
                </div>
                <div className="text-sm">{candidate?.email}</div>
                <div className="text-sm">{candidate?.phone}</div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("recruitment.interviews.schedule")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-10 w-10 text-muted-foreground bg-muted p-2 rounded-md" />
                <div>
                  <div className="font-medium">
                    {format(
                      new Date(interview.scheduledTime),
                      "EEEE, MMMM d, yyyy",
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("recruitment.interviews.date")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-10 w-10 text-muted-foreground bg-muted p-2 rounded-md" />
                <div>
                  <div className="font-medium">
                    {(() => {
                      const start = new Date(interview.scheduledTime);
                      const end = interview.scheduledEndTime
                        ? new Date(interview.scheduledEndTime)
                        : null;

                      if (end) {
                        return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
                      }
                      return format(start, "h:mm a");
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("recruitment.interviews.time")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ResumePreviewModal
        candidate={candidate || null}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
}
