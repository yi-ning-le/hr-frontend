import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InterviewsAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import type {
  CreateInterviewInput,
  UpdateInterviewNotesInput,
} from "@/types/recruitment.d";

const useInterviewSessionScope = () =>
  useAuthStore((state) => state.user?.id ?? state.token ?? "anonymous");

export function useCreateInterview() {
  const queryClient = useQueryClient();
  const sessionScope = useInterviewSessionScope();

  return useMutation({
    mutationFn: (data: CreateInterviewInput) => InterviewsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interviews", sessionScope],
      });
    },
  });
}

export function useMyInterviews() {
  const sessionScope = useInterviewSessionScope();

  return useQuery({
    queryKey: ["interviews", sessionScope, "me"],
    queryFn: InterviewsAPI.getMyInterviews,
  });
}

export function useInterview(id: string) {
  const sessionScope = useInterviewSessionScope();

  return useQuery({
    queryKey: ["interviews", sessionScope, id],
    queryFn: () => InterviewsAPI.get(id),
    enabled: !!id,
  });
}

export function useUpdateInterviewNotes() {
  const queryClient = useQueryClient();
  const sessionScope = useInterviewSessionScope();

  return useMutation({
    mutationFn: ({ id, notes }: UpdateInterviewNotesInput) =>
      InterviewsAPI.updateNotes(id, notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["interviews", sessionScope, data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["interviews", sessionScope, "me"],
      });
    },
  });
}
