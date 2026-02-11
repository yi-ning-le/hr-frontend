import { queryOptions, useQuery } from "@tanstack/react-query";
import { RecruitmentAPI } from "@/lib/api";

/**
 * Query key for user role data
 */
export const USER_ROLE_QUERY_KEY = ["userRole"] as const;

/**
 * Query options for user role data
 */
export const userRoleQueryOptions = queryOptions({
  queryKey: USER_ROLE_QUERY_KEY,
  queryFn: RecruitmentAPI.getMyRole,
  staleTime: 1000, // 1 second to deduplicate sequential router guard checks
  retry: 1,
  refetchOnWindowFocus: true, // Enable window focus refetching for role updates
});

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
    useQuery(userRoleQueryOptions);

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
