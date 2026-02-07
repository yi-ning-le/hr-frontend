import { useTranslation } from "react-i18next";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateEmployee,
  useUpdateEmployee,
} from "@/hooks/queries/useEmployees";
import type { Employee } from "@/types/employee";
import { useEffect } from "react";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
  readOnly?: boolean;
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
  readOnly = false,
}: EmployeeFormDialogProps) {
  const { t } = useTranslation();
  const { mutateAsync: createEmployee, isPending: isCreating } =
    useCreateEmployee();
  const { mutateAsync: updateEmployee, isPending: isUpdating } =
    useUpdateEmployee();
  const isLoading = isCreating || isUpdating;

  const employeeSchema = z.object({
    firstName: z
      .string()
      .min(
        1,
        t("employees.validation.firstNameRequired", "First name is required"),
      ),
    lastName: z
      .string()
      .min(
        1,
        t("employees.validation.lastNameRequired", "Last name is required"),
      ),
    email: z
      .string()
      .email(t("employees.validation.emailInvalid", "Invalid email address")),
    phone: z
      .string()
      .min(
        10,
        t(
          "employees.validation.phoneMin",
          "Phone must be at least 10 characters",
        ),
      ),
    department: z
      .string()
      .min(
        1,
        t("employees.validation.departmentRequired", "Department is required"),
      ),
    position: z
      .string()
      .min(
        1,
        t("employees.validation.positionRequired", "Position is required"),
      ),
    status: z.enum(["Active", "OnLeave", "Resigned", "Terminated"]),
    employmentType: z.enum(["FullTime", "PartTime", "Contract", "Intern"]),
    joinDate: z
      .string()
      .min(
        1,
        t("employees.validation.joinDateRequired", "Join date is required"),
      ),
  });

  type EmployeeFormData = z.infer<typeof employeeSchema>;

  const isEditing = !!employee;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      status: "Active",
      employmentType: "FullTime",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  // Reset form when employee changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      reset({
        firstName: employee?.firstName || "",
        lastName: employee?.lastName || "",
        email: employee?.email || "",
        phone: employee?.phone || "",
        department: employee?.department || "",
        position: employee?.position || "",
        status: employee?.status || "Active",
        employmentType: employee?.employmentType || "FullTime",
        joinDate: employee?.joinDate
          ? new Date(employee.joinDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [open, employee, reset]);

  const status = useWatch({ control, name: "status" });
  const employmentType = useWatch({ control, name: "employmentType" });

  const onSubmit = async (data: EmployeeFormData) => {
    if (readOnly) return;

    const payload = {
      ...data,
      joinDate: new Date(data.joinDate),
    };

    if (isEditing && employee) {
      await updateEmployee({ id: employee.id, data: payload });
    } else {
      await createEmployee(payload);
    }

    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {readOnly
              ? t("employees.viewDetails", "Employee Details")
              : isEditing
                ? t("employees.editEmployee", "Edit Employee")
                : t("employees.addEmployee", "Add Employee")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t("employees.form.firstName", "First Name")}
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                disabled={readOnly}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {t("employees.form.lastName", "Last Name")}
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                disabled={readOnly}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("employees.form.email", "Email")}</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={readOnly}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("employees.form.phone", "Phone")}</Label>
            <Input id="phone" {...register("phone")} disabled={readOnly} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">
                {t("employees.form.department", "Department")}
              </Label>
              <Input
                id="department"
                {...register("department")}
                disabled={readOnly}
              />
              {errors.department && (
                <p className="text-sm text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">
                {t("employees.form.position", "Position")}
              </Label>
              <Input
                id="position"
                {...register("position")}
                disabled={readOnly}
              />
              {errors.position && (
                <p className="text-sm text-red-500">
                  {errors.position.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("employees.form.status", "Status")}</Label>
              <Select
                value={status}
                onValueChange={(v) =>
                  setValue("status", v as EmployeeFormData["status"])
                }
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    {t("employees.status.active", "Active")}
                  </SelectItem>
                  <SelectItem value="OnLeave">
                    {t("employees.status.onLeave", "On Leave")}
                  </SelectItem>
                  <SelectItem value="Resigned">
                    {t("employees.status.resigned", "Resigned")}
                  </SelectItem>
                  <SelectItem value="Terminated">
                    {t("employees.status.terminated", "Terminated")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                {t("employees.form.employmentType", "Employment Type")}
              </Label>
              <Select
                value={employmentType}
                onValueChange={(v) =>
                  setValue(
                    "employmentType",
                    v as EmployeeFormData["employmentType"],
                  )
                }
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FullTime">
                    {t("employees.type.fullTime", "Full Time")}
                  </SelectItem>
                  <SelectItem value="PartTime">
                    {t("employees.type.partTime", "Part Time")}
                  </SelectItem>
                  <SelectItem value="Contract">
                    {t("employees.type.contract", "Contract")}
                  </SelectItem>
                  <SelectItem value="Intern">
                    {t("employees.type.intern", "Intern")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinDate">
              {t("employees.form.joinDate", "Join Date")}
            </Label>
            <Input
              id="joinDate"
              type="date"
              {...register("joinDate")}
              disabled={readOnly}
            />
            {errors.joinDate && (
              <p className="text-sm text-red-500">{errors.joinDate.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {readOnly
                ? t("common.close", "Close")
                : t("common.cancel", "Cancel")}
            </Button>
            {!readOnly && (
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("common.saving", "Saving...")
                  : isEditing
                    ? t("common.save", "Save")
                    : t("common.add", "Add")}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
