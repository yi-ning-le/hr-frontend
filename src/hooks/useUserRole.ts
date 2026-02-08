import { useQuery } from "@tanstack/react-query";
import type { RecruitmentRoleResponse } from "@/lib/api";
import { RecruitmentAPI } from "@/lib/api";

/**
 * Query key for user role data
 */
export const USER_ROLE_QUERY_KEY = ["userRole"] as const;

/**
 * Hook to fetch the current user's recruitment role status.
 * Uses TanStack Query for automatic caching, refetching, and stale data handling.
 *
 * @example
 * ```tsx
 * const { isAdmin, isRecruiter, isInterviewer, isLoading } = useUserRole();
 *
 * if (isAdmin) {
 *   // Show admin UI
 * }
 * ```
 */
export const useUserRole = () => {
  const { data, isLoading, isError, error, refetch } =
    useQuery<RecruitmentRoleResponse>({
      queryKey: USER_ROLE_QUERY_KEY,
      queryFn: RecruitmentAPI.getMyRole,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    });

  return {
    isAdmin: data?.isAdmin ?? false,
    isRecruiter: data?.isRecruiter ?? false,
    isInterviewer: data?.isInterviewer ?? false,
    isHR: data?.isHR ?? false,
    isLoading,
    isError,
    error,
    refetch,
  };
};
