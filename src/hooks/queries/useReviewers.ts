import { useQuery } from "@tanstack/react-query";
import { type Recruiter, RecruitmentAPI } from "@/lib/api";

export function useReviewers() {
  return useQuery<Recruiter[]>({
    queryKey: ["reviewers"],
    queryFn: async () => {
      const [recruiters, interviewers] = await Promise.all([
        RecruitmentAPI.getRecruiters(),
        RecruitmentAPI.getInterviewers(),
      ]);

      // Deduplicate by employeeId
      const map = new Map<string, Recruiter>();
      [...recruiters, ...interviewers].forEach((r) => {
        map.set(r.employeeId, r);
      });
      return Array.from(map.values());
    },
  });
}
