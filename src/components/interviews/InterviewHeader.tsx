import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Interview } from "@/types/recruitment.d";

interface InterviewHeaderProps {
  interview: Interview;
  isUpdating: boolean;
  onUpdateStatus: (id: string, status: "COMPLETED" | "CANCELLED") => void;
}

export function InterviewHeader({
  interview,
  isUpdating,
  onUpdateStatus,
}: InterviewHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <Link
        to="/my-interviews"
        search={{ viewMode: "list" }}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t("recruitment.interviews.backToMyInterviews")}
      </Link>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {t("recruitment.interviews.interviewDetails")}
          <Badge
            variant={
              interview.status === "PENDING"
                ? "default"
                : interview.status === "COMPLETED"
                  ? "secondary"
                  : "destructive"
            }
            className="text-base px-3 py-1"
          >
            {t(`recruitment.interviews.status.${interview.status}`)}
          </Badge>
        </h1>
        {interview.status === "PENDING" && (
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" disabled={isUpdating}>
                  {t("recruitment.interviews.complete", "Complete Interview")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("common.areYouSure", "Are you sure?")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "recruitment.interviews.completeConfirmation",
                      "This will mark the interview as completed.",
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("common.cancel", "Cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onUpdateStatus(interview.id, "COMPLETED")}
                  >
                    {t("common.confirm", "Confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isUpdating}>
                  {t("recruitment.interviews.cancel", "Cancel Interview")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("common.areYouSure", "Are you sure?")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "recruitment.interviews.cancelConfirmation",
                      "This will mark the interview as cancelled.",
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("common.cancel", "Cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onUpdateStatus(interview.id, "CANCELLED")}
                  >
                    {t("common.confirm", "Confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
