import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JobsAPI } from "@/lib/api";
import type { JobFormValues } from "@/pages/recruitment/components/jobs/forms/JobPositionForm";

export const JOBS_QUERY_KEY = ["jobs"] as const;

export const useJobs = () => {
  return useQuery({
    queryKey: JOBS_QUERY_KEY,
    queryFn: JobsAPI.list,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: JobFormValues) => JobsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: JobFormValues }) =>
      JobsAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...JOBS_QUERY_KEY, id] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => JobsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
};

export const useToggleJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => JobsAPI.toggleStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...JOBS_QUERY_KEY, id] });
    },
  });
};
