import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResumePreview } from "@/components/candidates/resume/ResumePreview";
import { Button } from "@/components/ui/button";
import type { Candidate } from "@/types/candidate";

interface CandidateResumeSectionProps {
  candidate: Candidate;
  onPreviewClick: () => void;
}

export function CandidateResumeSection({
  candidate,
  onPreviewClick,
}: CandidateResumeSectionProps) {
  const { t } = useTranslation();
  const hasResume = candidate.resumeUrl && candidate.resumeUrl !== "#";

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <FileText className="h-4 w-4" />{" "}
          {t("recruitment.candidates.detail.resumePreview")}
        </h4>
        <div className="flex gap-2">
          {hasResume ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => window.open(candidate.resumeUrl, "_blank")}
            >
              {t("recruitment.candidates.detail.downloadResume")}
            </Button>
          ) : null}
        </div>
      </div>

      {hasResume ? (
        <ResumePreview onClick={onPreviewClick} />
      ) : (
        <p className="text-sm text-muted-foreground">
          {t("recruitment.candidates.detail.noResume")}
        </p>
      )}
    </section>
  );
}
