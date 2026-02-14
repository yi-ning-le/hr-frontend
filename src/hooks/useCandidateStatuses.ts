import type { Candidate } from "@/types/candidate";
import type { Interview } from "@/types/recruitment.d";
import {
  useCandidateStatusQueries,
  useCreateCandidateStatus,
  useDeleteCandidateStatus,
  useReorderCandidateStatuses,
  useUpdateCandidateStatusMutation,
} from "./queries/useCandidateStatuses";

/**
 * Hook to access candidate statuses.
 * Refactored to use TanStack Query.
 */
export const useCandidateStatuses = () => {
  const { data, isLoading, error } = useCandidateStatusQueries();
  const createMutation = useCreateCandidateStatus();
  const updateMutation = useUpdateCandidateStatusMutation();
  const deleteMutation = useDeleteCandidateStatus();
  const reorderMutation = useReorderCandidateStatuses();

  return {
    statuses: data?.statuses ?? [],
    statusMap: data?.statusMap ?? {},
    isLoading,
    error,
    createStatus: (name: string, color: string) =>
      createMutation.mutateAsync({ name, color }),
    updateStatus: ({
      id,
      name,
      color,
    }: {
      id: string;
      name: string;
      color: string;
    }) => updateMutation.mutateAsync({ id, name, color }),
    deleteStatus: (id: string) => deleteMutation.mutateAsync(id),
    reorderStatuses: (ids: string[]) => reorderMutation.mutateAsync(ids),
  };
};

/**
 * Hook to resolve candidate status for an interview.
 * Prioritizes snapshot status, falling back to current candidate status.
 */
export const useResolveCandidateStatus = () => {
  const { statusMap } = useCandidateStatuses();

  const resolveStatus = (interview: Interview, candidate?: Candidate) => {
    if (interview.snapshotStatus) {
      // Use snapshot key to look up current color configuration
      // If key not found (status deleted), fallback to gray
      const currentDef = statusMap[interview.snapshotStatus.key];
      return {
        name: interview.snapshotStatus.label, // Always use the snapshot label
        color: currentDef?.color || "#999999",
      };
    }

    // Fallback to current candidate status
    if (candidate) {
      const currentDef = statusMap[candidate.status];
      return currentDef
        ? { name: currentDef.name, color: currentDef.color }
        : null;
    }

    return null;
  };

  return { resolveStatus };
};
