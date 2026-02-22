import { useQuery } from "@tanstack/react-query";
import { CandidatesAPI } from "@/lib/api";
import { CANDIDATES_QUERY_KEY } from "./useCandidates";

export const useReviewedCandidates = (enabled = true) => {
  return useQuery({
    queryKey: [...CANDIDATES_QUERY_KEY, "reviewed"],
    queryFn: CandidatesAPI.getReviewed,
    enabled,
  });
};
