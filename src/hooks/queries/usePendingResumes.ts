import { useQuery } from "@tanstack/react-query";
import { CandidatesAPI } from "@/lib/api";
import { useMyEmployeeProfile } from "./useMyEmployeeProfile";

export function usePendingResumes() {
  const { data: employee } = useMyEmployeeProfile();

  return useQuery({
    queryKey: ["pending-resumes", employee?.id],
    queryFn: async () => {
      if (!employee?.id) return [];

      return CandidatesAPI.list({
        reviewerId: employee.id,
        reviewStatus: "pending",
      });
    },
    enabled: !!employee?.id,
  });
}
