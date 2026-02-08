import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CandidateStatusesAPI } from "@/lib/api";
import type { CandidateStatusDefinition } from "@/types/candidate";

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
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      CandidateStatusesAPI.create(name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_STATUSES_QUERY_KEY });
      toast.success(t("settings.candidateStatus.messages.createSuccess"));
    },
    onError: () => {
      toast.error(t("settings.candidateStatus.messages.createError"));
    },
  });
};

export const useUpdateCandidateStatusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
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
      toast.success(t("settings.candidateStatus.messages.updateSuccess"));
    },
    onError: () => {
      toast.error(t("settings.candidateStatus.messages.updateError"));
    },
  });
};

export const useDeleteCandidateStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id: string) => CandidateStatusesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_STATUSES_QUERY_KEY });
      toast.success(t("settings.candidateStatus.messages.deleteSuccess"));
    },
    onError: () => {
      toast.error(t("settings.candidateStatus.messages.deleteError"));
    },
  });
};

export const useReorderCandidateStatuses = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (ids: string[]) => CandidateStatusesAPI.reorder(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_STATUSES_QUERY_KEY });
    },
    onError: () => {
      toast.error(t("settings.candidateStatus.messages.reorderError"));
    },
  });
};
