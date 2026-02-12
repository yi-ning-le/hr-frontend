import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentsAPI } from "@/lib/api";
import { CANDIDATES_QUERY_KEY } from "./useCandidates";

export const COMMENTS_QUERY_KEY = (candidateId: string) =>
  [...CANDIDATES_QUERY_KEY, candidateId, "comments"] as const;

export const useCandidateComments = (candidateId: string, enabled = true) => {
  return useQuery({
    queryKey: COMMENTS_QUERY_KEY(candidateId),
    queryFn: () => CommentsAPI.list(candidateId),
    enabled: enabled && !!candidateId,
  });
};

export const useAddCandidateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      candidateId,
      content,
    }: {
      candidateId: string;
      content: string;
    }) => CommentsAPI.create(candidateId, content),
    onSuccess: (_, { candidateId }) => {
      queryClient.invalidateQueries({
        queryKey: COMMENTS_QUERY_KEY(candidateId),
      });
    },
  });
};

export const useDeleteCandidateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; candidateId: string }) =>
      CommentsAPI.delete(commentId),
    onSuccess: (_, { candidateId }) => {
      queryClient.invalidateQueries({
        queryKey: COMMENTS_QUERY_KEY(candidateId),
      });
    },
  });
};
