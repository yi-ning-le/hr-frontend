import { useQuery } from "@tanstack/react-query";
import { EmployeesAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";

export function useMyEmployeeProfile() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["employee", "me"],
    queryFn: () => EmployeesAPI.getMe(),
    enabled: !!user?.id,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
