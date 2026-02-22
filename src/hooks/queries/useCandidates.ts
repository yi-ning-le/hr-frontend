import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CandidatesAPI } from "@/lib/api";
import type { Candidate, CandidateStatus } from "@/types/candidate";

export const CANDIDATES_QUERY_KEY = ["candidates"] as const;

import { keepPreviousData } from "@tanstack/react-query";

export const useCandidates = (
  filters: {
    jobId?: string;
    reviewerId?: string;
    reviewStatus?: string;
    status?: string;
    q?: string;
    page?: number;
    limit?: number;
  } = {},
) => {
  return useQuery({
    queryKey: [...CANDIDATES_QUERY_KEY, filters],
    queryFn: () => CandidatesAPI.list(filters),
    placeholderData: keepPreviousData,
  });
};

export const useCandidateCounts = () => {
  return useQuery({
    queryKey: [...CANDIDATES_QUERY_KEY, "counts"],
    queryFn: CandidatesAPI.getCounts,
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: [...CANDIDATES_QUERY_KEY, id],
    queryFn: () => CandidatesAPI.get(id),
    enabled: !!id,
  });
};

export const useCandidateHistory = (
  id: string,
  scope: "self" | "all" = "self",
) => {
  return useQuery({
    queryKey: [...CANDIDATES_QUERY_KEY, id, "history", scope],
    queryFn: () => CandidatesAPI.getHistory(id, scope),
    enabled: !!id,
  });
};

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      file,
    }: {
      data: Partial<Candidate>;
      file?: File;
    }) => {
      let candidate = await CandidatesAPI.create(data);
      if (file) {
        const result = await CandidatesAPI.uploadResume(candidate.id, file);
        candidate = result.candidate;
      }
      return candidate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATES_QUERY_KEY });
    },
  });
};

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Candidate>;
    }) => CandidatesAPI.update(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CANDIDATES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CANDIDATES_QUERY_KEY, id],
      });
    },
  });
};

export const useUpdateCandidateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CandidateStatus }) =>
      CandidatesAPI.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CANDIDATES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CANDIDATES_QUERY_KEY, id],
      });
    },
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CandidatesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATES_QUERY_KEY });
    },
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      CandidatesAPI.uploadResume(id, file),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CANDIDATES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CANDIDATES_QUERY_KEY, id],
      });
    },
  });
};
