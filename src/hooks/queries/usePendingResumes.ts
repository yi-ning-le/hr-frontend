import { useQuery } from "@tanstack/react-query";
import { CandidatesAPI } from "@/lib/api";

export function usePendingResumes() {
  return useQuery({
    queryKey: ["pending-resumes"],
    queryFn: CandidatesAPI.getPending,
  });
}
