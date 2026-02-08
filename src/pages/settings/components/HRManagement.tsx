import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";
import type { EmployeeAPIResponse, HREmployee } from "@/lib/api";
import { EmployeesAPI, RecruitmentAPI } from "@/lib/api";
import { AddHRDialog } from "./AddHRDialog";
import { HRTable } from "./HRTable";

export function HRManagement() {
  const { t } = useTranslation();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch HRs
  const { data: hrs = [], isLoading: hrsLoading } = useQuery<HREmployee[]>({
    queryKey: ["hrs"],
    queryFn: RecruitmentAPI.getHRs,
    enabled: isAdmin,
  });

  // Fetch employees for selection
  const { data: employeesData } = useQuery({
    queryKey: ["employees", "all"],
    queryFn: () => EmployeesAPI.list({ limit: 100 }),
    enabled: isAdmin && dialogOpen,
  });

  // Assign HR mutation
  const assignMutation = useMutation({
    mutationFn: (employeeId: string) => RecruitmentAPI.assignHR(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hrs"] });
      toast.success(
        t(
          "settings.hrManagement.assignSuccess",
          "HR role assigned successfully",
        ),
      );
      setDialogOpen(false);
    },
    onError: () => {
      toast.error(
        t("settings.hrManagement.assignError", "Failed to assign HR role"),
      );
    },
  });

  // Revoke HR mutation
  const revokeMutation = useMutation({
    mutationFn: (employeeId: string) => RecruitmentAPI.revokeHR(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hrs"] });
      toast.success(
        t(
          "settings.hrManagement.revokeSuccess",
          "HR role revoked successfully",
        ),
      );
    },
    onError: () => {
      toast.error(
        t("settings.hrManagement.revokeError", "Failed to revoke HR role"),
      );
    },
  });

  // Filter out existing HRs from employee list
  const hrIds = new Set(hrs.map((hr: HREmployee) => hr.employeeId));
  const availableEmployees =
    employeesData?.employees?.filter(
      (e: EmployeeAPIResponse) => !hrIds.has(e.id),
    ) ?? [];

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {t(
              "settings.hrManagement.adminOnly",
              "Admin access required to manage HR employees.",
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("settings.hrManagement.title", "HR Management")}
          </CardTitle>
          <CardDescription>
            {t(
              "settings.hrManagement.description",
              "Assign or revoke HR roles for employees.",
            )}
          </CardDescription>
        </div>
        <AddHRDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAssign={(id) => assignMutation.mutate(id)}
          isAssigning={assignMutation.isPending}
          availableEmployees={availableEmployees}
        />
      </CardHeader>
      <CardContent>
        <HRTable
          hrs={hrs}
          isLoading={hrsLoading}
          onRevoke={(id) => revokeMutation.mutate(id)}
          isRevoking={revokeMutation.isPending}
        />
      </CardContent>
    </Card>
  );
}
