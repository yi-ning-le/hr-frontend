import { Check, CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface EmployeeCreateSuccessProps {
  createdPassword: string;
  onClose: () => void;
}

export function EmployeeCreateSuccess({
  createdPassword,
  onClose,
}: EmployeeCreateSuccessProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-6 w-6" />
          {t("employees.createSuccess", "Employee Created Successfully")}
        </DialogTitle>
        <DialogDescription>
          {t(
            "employees.passwordNotice",
            "Please copy the temporary password below and share it with the employee. This password will not be shown again.",
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="my-4 space-y-2">
        <Label>{t("employees.temporaryPassword", "Temporary Password")}</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-md border bg-slate-50 p-3 font-mono text-lg font-bold tracking-wider dark:bg-slate-900">
            {createdPassword}
          </div>
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>{t("common.done", "Done")}</Button>
      </div>
    </DialogContent>
  );
}
