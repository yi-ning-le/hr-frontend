import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  Copy,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  getEmployeeStatusKey,
  getEmploymentTypeKey,
  getStatusVariant,
} from "@/lib/employee";
import type { Employee } from "@/types/employee";

interface EmployeeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
}

export function EmployeeDetailsDialog({
  open,
  onOpenChange,
  employee,
}: EmployeeDetailsDialogProps) {
  const { t } = useTranslation();

  if (!employee) return null;

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("employees.viewDetails", "Employee Details")}
          </DialogTitle>
          <VisuallyHidden.Root asChild>
            <DialogDescription>
              {t("employees.viewDetailsDesc", "View employee details")}
            </DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${fullName}&background=random`}
              alt={fullName}
            />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-semibold tracking-tight">
              {fullName}
            </h3>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{employee.position}</span>
            </div>
            <Badge variant={getStatusVariant(employee.status)} className="mt-2">
              {t(getEmployeeStatusKey(employee.status))}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              icon={<Building2 className="h-4 w-4" />}
              label={t("employees.form.department", "Department")}
              value={employee.department}
            />
            <DetailItem
              icon={<User className="h-4 w-4" />}
              label={t("employees.form.employmentType", "Type")}
              value={t(getEmploymentTypeKey(employee.employmentType))}
            />
            <DetailItem
              icon={<Calendar className="h-4 w-4" />}
              label={t("employees.form.joinDate", "Join Date")}
              value={new Date(employee.joinDate).toLocaleDateString()}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">
              {t("employees.contact", "Contact Information")}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                icon={<Mail className="h-4 w-4" />}
                label={t("employees.form.email", "Email")}
                value={employee.email}
                copyable
              />
              <DetailItem
                icon={<Phone className="h-4 w-4" />}
                label={t("employees.form.phone", "Phone")}
                value={employee.phone}
                copyable
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("common.close", "Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  copyable?: boolean;
}

function DetailItem({ icon, label, value, copyable }: DetailItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyable || !value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-start gap-3 text-sm group">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="space-y-0.5 flex-1 overflow-hidden">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate" title={value}>
            {value}
          </p>
          {copyable && value && (
            <button
              type="button"
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none rounded-md p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
