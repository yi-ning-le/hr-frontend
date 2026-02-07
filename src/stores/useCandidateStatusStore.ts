import { create } from "zustand";
import type { CandidateStatusDefinition } from "@/types/candidate";

interface CandidateStatusState {
  statuses: CandidateStatusDefinition[];
  statusMap: Record<string, CandidateStatusDefinition>;
}

/**
 * @deprecated Use useCandidateStatuses hook or useCandidateStatusQueries instead.
 */
export const useCandidateStatusStore = create<CandidateStatusState>(() => ({
  statuses: [],
  statusMap: {},
}));
