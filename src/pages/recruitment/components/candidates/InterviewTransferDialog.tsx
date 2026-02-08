import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserRole } from "@/hooks/useUserRole";
import { EmployeesAPI, RecruitmentAPI } from "@/lib/api";

interface InterviewTransferDialogProps {
  interviewId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName?: string;
}

export function InterviewTransferDialog({
  interviewId,
  open,
  onOpenChange,
  candidateName,
}: InterviewTransferDialogProps) {
  const { t } = useTranslation();
  const { isRecruiter } = useUserRole();
  const queryClient = useQueryClient();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  // Fetch employees for transfer target
  const { data: employeesData, isLoading: employeesLoading } = useQuery({
    queryKey: ["employees", "all"],
    queryFn: () => EmployeesAPI.list({ limit: 100 }),
    enabled: open && isRecruiter,
  });

  // Transfer mutation
  const transferMutation = useMutation({
    mutationFn: () =>
      RecruitmentAPI.transferInterview(interviewId, selectedEmployeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      toast.success(
        t("recruitment.transfer.success", "Interview transferred successfully"),
      );
      onOpenChange(false);
      setSelectedEmployeeId("");
    },
    onError: () => {
      toast.error(
        t("recruitment.transfer.error", "Failed to transfer interview"),
      );
    },
  });

  const employees = employeesData?.employees ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {t("recruitment.transfer.title", "Transfer Interview")}
          </DialogTitle>
          <DialogDescription>
            {candidateName
              ? t(
                  "recruitment.transfer.descriptionWithName",
                  "Transfer the interview for {{name}} to another employee.",
                  { name: candidateName },
                )
              : t(
                  "recruitment.transfer.description",
                  "Transfer this interview to another employee.",
                )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">
            {t("recruitment.transfer.selectEmployee", "Select New Interviewer")}
          </label>
          <Select
            value={selectedEmployeeId}
            onValueChange={setSelectedEmployeeId}
            disabled={employeesLoading}
          >
            <SelectTrigger>
              {employeesLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SelectValue
                  placeholder={t(
                    "recruitment.transfer.placeholder",
                    "Select an employee",
                  )}
                />
              )}
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} -{" "}
                  {employee.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            onClick={() => transferMutation.mutate()}
            disabled={!selectedEmployeeId || transferMutation.isPending}
          >
            {transferMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("recruitment.transfer.confirm", "Transfer")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
