import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InterviewsAPI } from "@/lib/api";
import type {
  CreateInterviewInput,
  UpdateInterviewNotesInput,
} from "@/types/recruitment.d";

export function useCreateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInterviewInput) => InterviewsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
}

export function useMyInterviews() {
  return useQuery({
    queryKey: ["interviews", "me"],
    queryFn: InterviewsAPI.getMyInterviews,
  });
}

export function useInterview(id: string) {
  return useQuery({
    queryKey: ["interviews", id],
    queryFn: () => InterviewsAPI.get(id),
    enabled: !!id,
  });
}

export function useUpdateInterviewNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: UpdateInterviewNotesInput) =>
      InterviewsAPI.updateNotes(id, notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["interviews", data.id] });
      queryClient.invalidateQueries({ queryKey: ["interviews", "me"] });
    },
  });
}
