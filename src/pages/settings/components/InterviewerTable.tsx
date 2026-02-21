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

interface InterviewerTableProps {
  interviewers: Recruiter[];
  isLoading: boolean;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}

export function InterviewerTable({
  interviewers,
  isLoading,
  onRevoke,
  isRevoking,
}: InterviewerTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (interviewers.length === 0) {
    return (
      <p className="text-center text-muted-foreground p-8">
        {t(
          "settings.interviewerManagement.noInterviewers",
          "No interviewers assigned yet.",
        )}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {t("settings.interviewerManagement.name", "Name")}
          </TableHead>
          <TableHead>
            {t("settings.interviewerManagement.department", "Department")}
          </TableHead>
          <TableHead>
            {t("settings.interviewerManagement.role", "Role")}
          </TableHead>
          <TableHead className="text-right">
            {t("settings.interviewerManagement.actions", "Actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interviewers.map((interviewer) => (
          <TableRow key={interviewer.employeeId}>
            <TableCell className="font-medium">
              {interviewer.firstName} {interviewer.lastName}
            </TableCell>
            <TableCell>{interviewer.department}</TableCell>
            <TableCell>
              <Badge variant="secondary">Interviewer</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRevoke(interviewer.employeeId)}
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
