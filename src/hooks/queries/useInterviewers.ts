import { useQuery } from "@tanstack/react-query";
import { type Recruiter, RecruitmentAPI } from "@/lib/api";

export function useInterviewers() {
  return useQuery<Recruiter[]>({
    queryKey: ["interviewers"],
    queryFn: RecruitmentAPI.getInterviewers,
  });
}
