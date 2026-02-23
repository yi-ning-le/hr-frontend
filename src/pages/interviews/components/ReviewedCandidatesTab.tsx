import { format } from "date-fns";
import { AlertCircle, FileText, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useReviewedCandidates } from "@/hooks/queries/useReviewedCandidates";
import { useDebounce } from "@/hooks/useDebounce";
import {
  filterReviewedCandidates,
  getCandidateReviewStatus,
  normalizeReviewedFilters,
} from "@/pages/interviews/reviewedFilters";
import { Route } from "@/routes/_protected/pending-resumes";

const STATUS_I18N_KEYS: Record<string, string> = {
  suitable: "candidate.suitable",
  unsuitable: "candidate.unsuitable",
};
const VISIBLE_STATUSES = Object.keys(STATUS_I18N_KEYS);

function formatDateOrFallback(
  value: string | Date | null | undefined,
  pattern: string,
) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return format(date, pattern);
}

export function ReviewedCandidatesTab() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const {
    data: candidates,
    isLoading,
    isError,
    error,
  } = useReviewedCandidates(true); // always hook it up, React Query caches anyway

  const normalizedFilters = useMemo(
    () => normalizeReviewedFilters(search, VISIBLE_STATUSES),
    [search],
  );
  const [localQuery, setLocalQuery] = useState(normalizedFilters.q || "");
  const debouncedSearchQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    setLocalQuery((prevQuery) =>
      prevQuery === normalizedFilters.q ? prevQuery : normalizedFilters.q,
    );
  }, [normalizedFilters.q]);

  useEffect(() => {
    if (debouncedSearchQuery !== normalizedFilters.q) {
      navigate({
        search: (prev) => ({ ...prev, q: debouncedSearchQuery }),
        replace: true,
      });
    }
  }, [debouncedSearchQuery, navigate, normalizedFilters.q]);

  const filteredCandidates = useMemo(
    () =>
      filterReviewedCandidates(candidates, {
        q: normalizedFilters.q,
        status: normalizedFilters.status,
      }),
    [candidates, normalizedFilters.q, normalizedFilters.status],
  );

  const getStatusLabel = (status: string) => {
    const i18nKey = STATUS_I18N_KEYS[status];
    return i18nKey ? t(i18nKey) : status;
  };

  const getStatusColor = (status: string) => {
    if (status === "suitable") {
      return "text-green-600 dark:text-green-500 font-medium";
    }
    if (status === "unsuitable") {
      return "text-red-600 dark:text-red-500 font-medium";
    }
    return "font-medium text-foreground";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("recruitment.candidates.reviewedListTitle", "Reviewed History")}
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
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            aria-label={t(
              "candidate.reviewStatusFilter",
              "Filter by review status",
            )}
            value={normalizedFilters.status}
            onChange={(e) =>
              navigate({
                search: (prev) => ({ ...prev, status: e.target.value }),
                replace: true,
              })
            }
            className="border rounded-md px-3 py-2 text-sm bg-background"
          >
            <option value="all">{t("common.all", "All")}</option>
            {VISIBLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

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
        ) : filteredCandidates.length > 0 ? (
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
                  {t("recruitment.candidates.detail.appliedAt", "Applied Date")}
                </TableHead>
                <TableHead>
                  {t("candidate.reviewTime", "Review Time")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => {
                const reviewStatus = getCandidateReviewStatus(candidate);
                return (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">
                      {candidate.name}
                    </TableCell>
                    <TableCell>{candidate.appliedJobTitle}</TableCell>
                    <TableCell className={getStatusColor(reviewStatus)}>
                      {getStatusLabel(reviewStatus)}
                    </TableCell>
                    <TableCell>
                      {formatDateOrFallback(candidate.appliedAt, "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>
                      {formatDateOrFallback(
                        candidate.reviewedAt,
                        "yyyy-MM-dd HH:mm",
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
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
  );
}
