import { Loader2, UserMinus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { HREmployee } from "@/lib/api";

interface HRTableProps {
  hrs: HREmployee[];
  isLoading: boolean;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}

export function HRTable({
  hrs,
  isLoading,
  onRevoke,
  isRevoking,
}: HRTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (hrs.length === 0) {
    return (
      <p className="text-center text-muted-foreground p-8">
        {t("settings.hrManagement.noHRs", "No HR employees assigned yet.")}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("settings.hrManagement.name", "Name")}</TableHead>
          <TableHead>
            {t("settings.hrManagement.department", "Department")}
          </TableHead>
          <TableHead>{t("settings.hrManagement.role", "Role")}</TableHead>
          <TableHead className="text-right">
            {t("settings.hrManagement.actions", "Actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hrs.map((hr) => (
          <TableRow key={hr.employeeId}>
            <TableCell className="font-medium">
              {hr.firstName} {hr.lastName}
            </TableCell>
            <TableCell>{hr.department}</TableCell>
            <TableCell>
              <Badge variant="default">HR</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRevoke(hr.employeeId)}
                disabled={isRevoking}
              >
                {isRevoking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserMinus className="h-4 w-4 text-destructive" />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
