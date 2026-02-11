import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmployeesAPI } from "@/lib/api";
import type {
  Employee,
  EmployeeInput,
  EmployeeStatus,
  EmploymentType,
} from "@/types/employee";

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
    queryFn: async () => {
      const result = await EmployeesAPI.list(options);

      const employees: Employee[] = result.employees.map((e) => ({
        ...e,
        status: e.status as EmployeeStatus,
        employmentType: e.employmentType as EmploymentType,
        joinDate: new Date(e.joinDate),
      }));

      return {
        employees,
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    },
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: [...EMPLOYEE_QUERY_KEY, id],
    queryFn: async () => {
      const result = await EmployeesAPI.get(id);
      return {
        ...result,
        status: result.status as EmployeeStatus,
        employmentType: result.employmentType as EmploymentType,
        joinDate: new Date(result.joinDate),
      } as Employee;
    },
    enabled: !!id,
  });
};

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
