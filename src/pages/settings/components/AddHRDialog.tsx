import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, UserPlus } from "lucide-react";
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
import type { EmployeeAPIResponse } from "@/lib/api";

interface AddHRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (employeeId: string) => void;
  isAssigning: boolean;
  availableEmployees: EmployeeAPIResponse[];
}

export function AddHRDialog({
  open,
  onOpenChange,
  onAssign,
  isAssigning,
  availableEmployees,
}: AddHRDialogProps) {
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
          {t("settings.hrManagement.addHR", "Add HR")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("settings.hrManagement.addHRTitle", "Assign HR Role")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "settings.hrManagement.addHRDescription",
              "Select an employee to grant HR privileges.",
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
                  "settings.hrManagement.selectEmployee",
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
            {t("settings.hrManagement.assign", "Assign")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
