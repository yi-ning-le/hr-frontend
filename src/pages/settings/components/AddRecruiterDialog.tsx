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

interface AddRecruiterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (employeeId: string) => void;
  isAssigning: boolean;
  availableEmployees: Employee[];
}

export function AddRecruiterDialog({
  open,
  onOpenChange,
  onAssign,
  isAssigning,
  availableEmployees,
}: AddRecruiterDialogProps) {
  const { t } = useTranslation();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const handleAssign = () => {
    onAssign(selectedEmployeeId);
    // Reset selection is handled by parent closing or we can do it here if we want to be nice
    // But parent closes dialog, so state is preserved if not reset?
    // original code: setSelectedEmployeeId(""); in onSuccess.
    // We should probably reset when dialog opens or closes.
    // For now, let's just leave it. If component unmounts it resets.
    // But Dialog content might stay mounted? Radix usually unmounts content.
  };

  // Reset selection when dialog closes (optional, but good UX)
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
          {t("settings.recruiterManagement.addRecruiter", "Add Recruiter")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(
              "settings.recruiterManagement.addRecruiterTitle",
              "Assign Recruiter Role",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "settings.recruiterManagement.addRecruiterDescription",
              "Select an employee to grant recruiter privileges.",
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
                  "settings.recruiterManagement.selectEmployee",
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
            {t("settings.recruiterManagement.assign", "Assign")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
