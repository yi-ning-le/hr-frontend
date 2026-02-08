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
import type { Recruiter } from "@/lib/api";

interface RecruiterTableProps {
  recruiters: Recruiter[];
  isLoading: boolean;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}

export function RecruiterTable({
  recruiters,
  isLoading,
  onRevoke,
  isRevoking,
}: RecruiterTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (recruiters.length === 0) {
    return (
      <p className="text-center text-muted-foreground p-8">
        {t(
          "settings.recruiterManagement.noRecruiters",
          "No recruiters assigned yet.",
        )}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {t("settings.recruiterManagement.name", "Name")}
          </TableHead>
          <TableHead>
            {t("settings.recruiterManagement.department", "Department")}
          </TableHead>
          <TableHead>
            {t("settings.recruiterManagement.role", "Role")}
          </TableHead>
          <TableHead className="text-right">
            {t("settings.recruiterManagement.actions", "Actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recruiters.map((recruiter) => (
          <TableRow key={recruiter.employeeId}>
            <TableCell className="font-medium">
              {recruiter.firstName} {recruiter.lastName}
            </TableCell>
            <TableCell>{recruiter.department}</TableCell>
            <TableCell>
              <Badge variant="secondary">Recruiter</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRevoke(recruiter.employeeId)}
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
