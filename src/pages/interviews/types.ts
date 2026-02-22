import type { Candidate } from "@/types/candidate";

export type PendingCandidateRow = Pick<
  Candidate,
  "id" | "name" | "appliedJobTitle" | "experienceYears"
> & {
  appliedAt: string | Date;
};

export type ReviewedCandidateRow = Pick<
  Candidate,
  "id" | "name" | "appliedJobTitle" | "status" | "reviewStatus"
> & {
  appliedAt: string | Date;
  reviewedAt?: string | null;
};

export interface ReviewedFilters {
  q: string;
  status: string;
}

export const DEFAULT_REVIEWED_FILTERS: ReviewedFilters = {
  q: "",
  status: "all",
};
