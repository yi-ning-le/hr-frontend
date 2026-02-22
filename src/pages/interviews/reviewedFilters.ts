import {
  DEFAULT_REVIEWED_FILTERS,
  type ReviewedCandidateRow,
  type ReviewedFilters,
} from "./types";

export function getCandidateReviewStatus(candidate: ReviewedCandidateRow) {
  return candidate.reviewStatus || candidate.status;
}

export function getReviewStatusOptions(candidates?: ReviewedCandidateRow[]) {
  if (!candidates) return [];
  const statuses = new Set(candidates.map(getCandidateReviewStatus));
  return Array.from(statuses).filter(Boolean);
}

export function normalizeReviewedFilters(
  search: { q?: string; status?: string },
  validStatuses: readonly string[],
): ReviewedFilters {
  const q = search.q ?? DEFAULT_REVIEWED_FILTERS.q;
  const status = search.status ?? DEFAULT_REVIEWED_FILTERS.status;
  const normalizedStatus =
    status === DEFAULT_REVIEWED_FILTERS.status || validStatuses.includes(status)
      ? status
      : DEFAULT_REVIEWED_FILTERS.status;

  return { q, status: normalizedStatus };
}

export function filterReviewedCandidates(
  candidates: ReviewedCandidateRow[] | undefined,
  filters: ReviewedFilters,
) {
  if (!candidates) return [];

  const query = filters.q.trim().toLowerCase();

  return candidates.filter((candidate) => {
    if (filters.status !== "all") {
      const candidateStatus = getCandidateReviewStatus(candidate);
      if (candidateStatus !== filters.status) {
        return false;
      }
    }

    if (!query) {
      return true;
    }

    return (
      candidate.name.toLowerCase().includes(query) ||
      candidate.appliedJobTitle.toLowerCase().includes(query)
    );
  });
}
