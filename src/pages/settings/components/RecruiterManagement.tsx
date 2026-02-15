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
import type { Recruiter } from "@/lib/api";
import { EmployeesAPI, RecruitmentAPI } from "@/lib/api";
import type { Employee } from "@/types/employee";
import { AddRecruiterDialog } from "./AddRecruiterDialog";
import { RecruiterTable } from "./RecruiterTable";

export function RecruiterManagement() {
  const { t } = useTranslation();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch recruiters
  const { data: recruiters = [], isLoading: recruitersLoading } = useQuery<
    Recruiter[]
  >({
    queryKey: ["recruiters"],
    queryFn: RecruitmentAPI.getRecruiters,
    enabled: isAdmin,
  });

  // Fetch employees for selection
  const { data: employeesData } = useQuery({
    queryKey: ["employees", "all"],
    queryFn: () => EmployeesAPI.list({ limit: 100 }),
    enabled: isAdmin && dialogOpen,
  });

  // Assign recruiter mutation
  const assignMutation = useMutation({
    mutationFn: (employeeId: string) =>
      RecruitmentAPI.assignRecruiter(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiters"] });
      toast.success(
        t(
          "settings.recruiterManagement.assignSuccess",
          "Recruiter role assigned successfully",
        ),
      );
      setDialogOpen(false);
    },
    onError: () => {
      toast.error(
        t(
          "settings.recruiterManagement.assignError",
          "Failed to assign recruiter role",
        ),
      );
    },
  });

  // Revoke recruiter mutation
  const revokeMutation = useMutation({
    mutationFn: (employeeId: string) =>
      RecruitmentAPI.revokeRecruiter(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiters"] });
      toast.success(
        t(
          "settings.recruiterManagement.revokeSuccess",
          "Recruiter role revoked successfully",
        ),
      );
    },
    onError: () => {
      toast.error(
        t(
          "settings.recruiterManagement.revokeError",
          "Failed to revoke recruiter role",
        ),
      );
    },
  });

  // Filter out existing recruiters from employee list
  const recruiterIds = new Set(recruiters.map((r: Recruiter) => r.employeeId));
  const availableEmployees =
    employeesData?.employees?.filter(
      (e: Employee) => !recruiterIds.has(e.id),
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
              "settings.recruiterManagement.adminOnly",
              "Admin access required to manage recruiters.",
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
            {t("settings.recruiterManagement.title", "Recruiter Management")}
          </CardTitle>
          <CardDescription>
            {t(
              "settings.recruiterManagement.description",
              "Assign or revoke recruiter roles for employees.",
            )}
          </CardDescription>
        </div>
        <AddRecruiterDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAssign={(id) => assignMutation.mutate(id)}
          isAssigning={assignMutation.isPending}
          availableEmployees={availableEmployees}
        />
      </CardHeader>
      <CardContent>
        <RecruiterTable
          recruiters={recruiters}
          isLoading={recruitersLoading}
          onRevoke={(id) => revokeMutation.mutate(id)}
          isRevoking={revokeMutation.isPending}
        />
      </CardContent>
    </Card>
  );
}
