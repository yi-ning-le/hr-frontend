import { useQuery } from "@tanstack/react-query";
import { CandidatesAPI } from "@/lib/api";
import { useMyEmployeeProfile } from "./useEmployees";

export function usePendingResumes() {
  const { data: employee } = useMyEmployeeProfile();

  return useQuery({
    queryKey: ["pending-resumes", employee?.id],
    queryFn: async () => {
      if (!employee?.id) return [];

      const response = await CandidatesAPI.list({
        reviewerId: employee.id,
        reviewStatus: "pending",
      });

      return response.data;
    },
    enabled: !!employee?.id,
  });
}
