import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import {
  useCreateEmployee,
  useUpdateEmployee,
} from "@/hooks/queries/useEmployees";
import type { Employee } from "@/types/employee";
import { EmployeeCreateSuccess } from "./EmployeeCreateSuccess";
import { EmployeeForm, type EmployeeFormData } from "./EmployeeForm";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
}: EmployeeFormDialogProps) {
  const { mutateAsync: createEmployee, isPending: isCreating } =
    useCreateEmployee();
  const { mutateAsync: updateEmployee, isPending: isUpdating } =
    useUpdateEmployee();
  const isLoading = isCreating || isUpdating;

  const isEditing = !!employee;
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);

  const onSubmit = async (data: EmployeeFormData) => {
    const payload = {
      ...data,
      joinDate: new Date(data.joinDate),
    };

    if (isEditing && employee) {
      await updateEmployee({ id: employee.id, data: payload });
      onOpenChange(false);
    } else {
      const result = await createEmployee(payload);
      if (result.temporaryPassword) {
        setCreatedPassword(result.temporaryPassword);
      } else {
        onOpenChange(false);
      }
    }
  };

  const handleCloseSuccess = () => {
    setCreatedPassword(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {createdPassword ? (
        <EmployeeCreateSuccess
          createdPassword={createdPassword}
          onClose={handleCloseSuccess}
        />
      ) : (
        <EmployeeForm
          employee={employee}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      )}
    </Dialog>
  );
}
