import { queryOptions, useQuery } from "@tanstack/react-query";
import { RecruitmentAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Query key for user role data
 */
export const USER_ROLE_QUERY_KEY = ["userRole"] as const;

const getSessionScope = () => {
  const { user, token } = useAuthStore.getState();
  return user?.id ?? token ?? "anonymous";
};

export const buildUserRoleQueryKey = (sessionScope = getSessionScope()) =>
  [...USER_ROLE_QUERY_KEY, sessionScope] as const;

/**
 * Query options for user role data
 */
export const userRoleQueryOptions = (sessionScope = getSessionScope()) =>
  queryOptions({
    queryKey: buildUserRoleQueryKey(sessionScope),
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
  const sessionScope = useAuthStore((state) => state.user?.id ?? state.token);
  const { data, isLoading, isError, error, refetch } = useQuery(
    userRoleQueryOptions(sessionScope ?? "anonymous"),
  );

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
