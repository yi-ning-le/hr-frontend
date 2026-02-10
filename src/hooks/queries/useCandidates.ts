import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CandidatesAPI } from "@/lib/api";
import type { Candidate, CandidateStatus } from "@/types/candidate";

export const CANDIDATES_QUERY_KEY = ["candidates"] as const;

export const useCandidates = (jobId: string = "all") => {
  return useQuery({
    queryKey: [...CANDIDATES_QUERY_KEY, jobId],
    queryFn: async () => {
      const result = await CandidatesAPI.list({
        jobId: jobId === "all" ? undefined : jobId,
      });
      // Ensure we have Date objects
      return result.map((c) => ({
        ...c,
        appliedAt: new Date(c.appliedAt),
      }));
    },
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

export const useUpdateCandidateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      CandidatesAPI.updateNote(id, note),
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
