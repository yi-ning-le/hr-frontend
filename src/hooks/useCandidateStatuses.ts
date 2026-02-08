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
