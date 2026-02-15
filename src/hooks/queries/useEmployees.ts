import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmployeesAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import type { EmployeeInput } from "@/types/employee";

export const EMPLOYEE_QUERY_KEY = ["employees"] as const;

interface UseEmployeesOptions {
  status?: string;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const useEmployees = (options: UseEmployeesOptions = {}) => {
  return useQuery({
    queryKey: [...EMPLOYEE_QUERY_KEY, options],
    queryFn: () => EmployeesAPI.list(options),
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: [...EMPLOYEE_QUERY_KEY, id],
    queryFn: () => EmployeesAPI.get(id),
    enabled: !!id,
  });
};

export function useMyEmployeeProfile() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [...EMPLOYEE_QUERY_KEY, "me"],
    queryFn: () => EmployeesAPI.getMe(),
    enabled: !!user?.id,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeInput) => {
      return EmployeesAPI.create({
        ...data,
        status: data.status || "Active",
        employmentType: data.employmentType || "FullTime",
        joinDate: data.joinDate.toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeInput }) => {
      return EmployeesAPI.update(id, {
        ...data,
        status: data.status || "Active",
        employmentType: data.employmentType || "FullTime",
        joinDate: data.joinDate.toISOString(),
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...EMPLOYEE_QUERY_KEY, id] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => EmployeesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
    },
  });
};
