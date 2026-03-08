import { FileText, RefreshCw } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ResumePreview } from "@/components/candidates/resume/ResumePreview";
import { Button } from "@/components/ui/button";
import type { Candidate } from "@/types/candidate";

interface CandidateResumeSectionProps {
  candidate: Candidate;
  onPreviewClick: () => void;
  onResumeUpdate?: (file: File) => void;
  isResumeUpdating?: boolean;
}

export function CandidateResumeSection({
  candidate,
  onPreviewClick,
  onResumeUpdate,
  isResumeUpdating = false,
}: CandidateResumeSectionProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasResume = candidate.resumeUrl && candidate.resumeUrl !== "#";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onResumeUpdate) {
      onResumeUpdate(file);
    }
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <FileText className="h-4 w-4" />{" "}
          {t("recruitment.candidates.detail.resumePreview")}
        </h4>
        <div className="flex gap-2">
          {hasResume ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => window.open(candidate.resumeUrl, "_blank")}
              >
                {t("recruitment.candidates.detail.downloadResume")}
              </Button>
              {onResumeUpdate ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  disabled={isResumeUpdating}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RefreshCw
                    className={`h-3 w-3 mr-1 ${isResumeUpdating ? "animate-spin" : ""}`}
                  />
                  {t("recruitment.candidates.detail.replaceResume")}
                </Button>
              ) : null}
            </>
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

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        disabled={isResumeUpdating}
        onChange={handleFileChange}
        data-testid="resume-file-input"
      />
    </section>
  );
}
