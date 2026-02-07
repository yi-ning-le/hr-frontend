import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CandidateStatusesAPI } from "@/lib/api";
import type { CandidateStatusDefinition } from "@/types/candidate";
import { toast } from "sonner";

export const CANDIDATE_STATUSES_QUERY_KEY = ["candidate-statuses"] as const;

export const useCandidateStatusQueries = () => {
  return useQuery({
    queryKey: CANDIDATE_STATUSES_QUERY_KEY,
    queryFn: async () => {
      const statuses = await CandidateStatusesAPI.list();
      const statusMap = statuses.reduce(
        (acc, status) => {
          acc[status.slug] = status;
          acc[status.id] = status;
          return acc;
        },
        {} as Record<string, CandidateStatusDefinition>,
      );
      return { statuses, statusMap };
    },
  });
};

export const useCreateCandidateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      CandidateStatusesAPI.create(name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_STATUSES_QUERY_KEY });
      toast.success("Status created");
    },
    onError: () => {
      toast.error("Failed to create status");
    },
  });
};

export const useUpdateCandidateStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      name,
      color,
    }: {
      id: string;
      name: string;
      color: string;
    }) => CandidateStatusesAPI.update(id, name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_STATUSES_QUERY_KEY });
      toast.success("Status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });
};

export const useDeleteCandidateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CandidateStatusesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_STATUSES_QUERY_KEY });
      toast.success("Status deleted");
    },
    onError: () => {
      toast.error("Failed to delete status");
    },
  });
};

export const useReorderCandidateStatuses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => CandidateStatusesAPI.reorder(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_STATUSES_QUERY_KEY });
    },
    onError: () => {
      toast.error("Failed to reorder statuses");
    },
  });
};
