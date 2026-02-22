import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCandidateHistory } from "@/hooks/queries/useCandidates";

export function CandidateActivityTimeline({
  candidateId,
  scope = "self",
}: {
  candidateId: string;
  scope?: "self" | "all";
}) {
  const { t } = useTranslation();
  const {
    data: history,
    isLoading,
    isError,
    error,
  } = useCandidateHistory(candidateId, scope);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2
          className="h-6 w-6 animate-spin text-muted-foreground"
          data-testid="loading-spinner"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-4 text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : t("common.error.fetch", "Failed to fetch data")}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        {t("recruitment.candidates.history.empty", "No history found")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {t("recruitment.candidates.history.title", "Processing History")}
      </h3>
      <div className="relative border-l ml-3 pl-4 space-y-6">
        {history.map((record, index) => (
          <div
            key={
              record.id ??
              `${record.candidateId}-${record.appliedAt}-${record.jobTitle}-${index}`
            }
            className="relative"
          >
            <div className="absolute -left-6 top-1 h-4 w-4 rounded-full border-2 border-background bg-primary" />
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-semibold">{record.jobTitle}</span>
              <div className="text-sm text-muted-foreground flex gap-2">
                <span>{record.status}</span>
                {record.reviewStatus && (
                  <>
                    <span>•</span>
                    <span>{record.reviewStatus}</span>
                  </>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {format(new Date(record.appliedAt), "MMM d, yyyy h:mm a")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
