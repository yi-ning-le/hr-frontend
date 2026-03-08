import { useParams } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CandidateCommentsSection } from "@/components/candidates/comments/CandidateCommentsSection";
import { ResumePreviewModal } from "@/components/candidates/ResumePreviewModal";
import { InterviewCandidateCard } from "@/components/interviews/InterviewCandidateCard";
import { InterviewHeader } from "@/components/interviews/InterviewHeader";
import { InterviewScheduleCard } from "@/components/interviews/InterviewScheduleCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidate } from "@/hooks/queries/useCandidates";
import {
  useInterview,
  useUpdateInterviewStatus,
} from "@/hooks/queries/useInterviews";
import { useResolveCandidateStatus } from "@/hooks/useCandidateStatuses";
import type { UpdateInterviewStatusPayload } from "@/types/recruitment.d";

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
  const { resolveStatus } = useResolveCandidateStatus();

  // Prefer snapshot status from interview, fallback to current candidate status
  const statusDef = interview ? resolveStatus(interview, candidate) : null;

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateInterviewStatus();

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

  const handleUpdateStatus = (input: UpdateInterviewStatusPayload) => {
    updateStatus(input);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <InterviewHeader
        interview={interview}
        isUpdating={isUpdating}
        onUpdateStatus={handleUpdateStatus}
      />

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
          <InterviewCandidateCard
            candidate={candidate}
            statusDef={statusDef}
            onPreviewResume={() => setIsPreviewOpen(true)}
          />

          <InterviewScheduleCard interview={interview} />
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
