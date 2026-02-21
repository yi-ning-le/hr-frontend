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
import { AddInterviewerDialog } from "./AddInterviewerDialog";
import { InterviewerTable } from "./InterviewerTable";

export function InterviewerManagement() {
  const { t } = useTranslation();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch interviewers
  const { data: interviewers = [], isLoading: interviewersLoading } = useQuery<
    Recruiter[]
  >({
    queryKey: ["interviewers"],
    queryFn: RecruitmentAPI.getInterviewers,
    enabled: isAdmin,
  });

  // Fetch employees for selection
  const { data: employeesData } = useQuery({
    queryKey: ["employees", "all"],
    queryFn: () => EmployeesAPI.list({ limit: 100 }),
    enabled: isAdmin && dialogOpen,
  });

  // Assign interviewer mutation
  const assignMutation = useMutation({
    mutationFn: (employeeId: string) =>
      RecruitmentAPI.assignInterviewer(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviewers"] });
      toast.success(
        t(
          "settings.interviewerManagement.assignSuccess",
          "Interviewer role assigned successfully",
        ),
      );
      setDialogOpen(false);
    },
    onError: () => {
      toast.error(
        t(
          "settings.interviewerManagement.assignError",
          "Failed to assign interviewer role",
        ),
      );
    },
  });

  // Revoke interviewer mutation
  const revokeMutation = useMutation({
    mutationFn: (employeeId: string) =>
      RecruitmentAPI.revokeInterviewer(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviewers"] });
      toast.success(
        t(
          "settings.interviewerManagement.revokeSuccess",
          "Interviewer role revoked successfully",
        ),
      );
    },
    onError: () => {
      toast.error(
        t(
          "settings.interviewerManagement.revokeError",
          "Failed to revoke interviewer role",
        ),
      );
    },
  });

  // Filter out existing interviewers from employee list
  const interviewerIds = new Set(
    interviewers.map((i: Recruiter) => i.employeeId),
  );
  const availableEmployees =
    employeesData?.employees?.filter(
      (e: Employee) => !interviewerIds.has(e.id),
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
              "settings.interviewerManagement.adminOnly",
              "Admin access required to manage interviewers.",
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
            {t(
              "settings.interviewerManagement.title",
              "Interviewer Management",
            )}
          </CardTitle>
          <CardDescription>
            {t(
              "settings.interviewerManagement.description",
              "Assign or revoke interviewer roles for employees.",
            )}
          </CardDescription>
        </div>
        <AddInterviewerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAssign={(id) => assignMutation.mutate(id)}
          isAssigning={assignMutation.isPending}
          availableEmployees={availableEmployees}
        />
      </CardHeader>
      <CardContent>
        <InterviewerTable
          interviewers={interviewers}
          isLoading={interviewersLoading}
          onRevoke={(id) => revokeMutation.mutate(id)}
          isRevoking={revokeMutation.isPending}
        />
      </CardContent>
    </Card>
  );
}
