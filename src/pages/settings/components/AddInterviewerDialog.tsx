import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/types/employee";

interface AddInterviewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (employeeId: string) => void;
  isAssigning: boolean;
  availableEmployees: Employee[];
}

export function AddInterviewerDialog({
  open,
  onOpenChange,
  onAssign,
  isAssigning,
  availableEmployees,
}: AddInterviewerDialogProps) {
  const { t } = useTranslation();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const handleAssign = () => {
    onAssign(selectedEmployeeId);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedEmployeeId("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          {t(
            "settings.interviewerManagement.addInterviewer",
            "Add Interviewer",
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(
              "settings.interviewerManagement.addInterviewerTitle",
              "Assign Interviewer Role",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "settings.interviewerManagement.addInterviewerDescription",
              "Select an employee to grant interviewer privileges.",
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select
            value={selectedEmployeeId}
            onValueChange={setSelectedEmployeeId}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "settings.interviewerManagement.selectEmployee",
                  "Select an employee",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {availableEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} -{" "}
                  {employee.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedEmployeeId || isAssigning}
          >
            {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("settings.interviewerManagement.assign", "Assign")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
