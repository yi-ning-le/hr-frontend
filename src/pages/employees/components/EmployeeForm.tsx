import { zodResolver } from "@hookform/resolvers/zod";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/types/employee";

// Define the schema outside the component or export it if needed elsewhere
// Moving it inside the component to use `t` for translations as in the original code

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

// We need to export this type for the parent component to use if necessary,
// but here we define it based on the schema which depends on `t`.
// To make it cleaner, we can define the schema shape first or just infer it inside.
// For now, I'll keep the schema definition inside to support translations.

// Helper to define the shape of data we expect
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: "Active" | "OnLeave" | "Resigned" | "Terminated";
  employmentType: "FullTime" | "PartTime" | "Contract" | "Intern";
  joinDate: string;
}

export function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  isLoading,
}: EmployeeFormProps) {
  const { t } = useTranslation();
  const isEditing = !!employee;

  const employeeSchema = useMemo(
    () =>
      z.object({
        firstName: z
          .string()
          .min(
            1,
            t(
              "employees.validation.firstNameRequired",
              "First name is required",
            ),
          ),
        lastName: z
          .string()
          .min(
            1,
            t("employees.validation.lastNameRequired", "Last name is required"),
          ),
        email: z
          .string()
          .email(
            t("employees.validation.emailInvalid", "Invalid email address"),
          ),
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
            t(
              "employees.validation.departmentRequired",
              "Department is required",
            ),
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
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
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
    },
  });

  const status = useWatch({ control, name: "status" });
  const employmentType = useWatch({ control, name: "employmentType" });

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {isEditing
            ? t("employees.editEmployee", "Edit Employee")
            : t("employees.addEmployee", "Add Employee")}
        </DialogTitle>
        <VisuallyHidden.Root asChild>
          <DialogDescription>
            {isEditing
              ? t("employees.editEmployeeDesc", "Edit employee information")
              : t(
                  "employees.addEmployeeDesc",
                  "Add a new employee to the system",
                )}
          </DialogDescription>
        </VisuallyHidden.Root>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              {t("employees.form.firstName", "First Name")}
            </Label>
            <Input id="firstName" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">
              {t("employees.form.lastName", "Last Name")}
            </Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("employees.form.email", "Email")}</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("employees.form.phone", "Phone")}</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">
              {t("employees.form.department", "Department")}
            </Label>
            <Input id="department" {...register("department")} />
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
            <Input id="position" {...register("position")} />
            {errors.position && (
              <p className="text-sm text-red-500">{errors.position.message}</p>
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
          <Input id="joinDate" type="date" {...register("joinDate")} />
          {errors.joinDate && (
            <p className="text-sm text-red-500">{errors.joinDate.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("common.saving", "Saving...")
              : isEditing
                ? t("common.save", "Save")
                : t("common.add", "Add")}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
