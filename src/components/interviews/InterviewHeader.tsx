import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type {
  Interview,
  UpdateInterviewStatusPayload,
} from "@/types/recruitment.d";

interface InterviewHeaderProps {
  interview: Interview;
  isUpdating: boolean;
  onUpdateStatus: (input: UpdateInterviewStatusPayload) => void;
}

export function InterviewHeader({
  interview,
  isUpdating,
  onUpdateStatus,
}: InterviewHeaderProps) {
  const { t } = useTranslation();
  const [result, setResult] = useState<"PASS" | "FAIL" | "">("");

  const handleComplete = () => {
    if (result === "PASS" || result === "FAIL") {
      onUpdateStatus({
        id: interview.id,
        status: "COMPLETED",
        result,
      });
    }
  };

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
                    {t(
                      "recruitment.interviews.completeTitle",
                      "Complete Interview",
                    )}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "recruitment.interviews.completeDescription",
                      "Select the interview result.",
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {t("recruitment.interviews.result", "Interview Result")}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <RadioGroup
                      value={result}
                      onValueChange={(v) => setResult(v as "PASS" | "FAIL")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="PASS" id="result-pass" />
                        <Label
                          htmlFor="result-pass"
                          className="text-green-600 dark:text-green-400 font-medium cursor-pointer"
                        >
                          {t("recruitment.interviews.resultPass", "Pass")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="FAIL" id="result-fail" />
                        <Label
                          htmlFor="result-fail"
                          className="text-red-600 dark:text-red-400 font-medium cursor-pointer"
                        >
                          {t("recruitment.interviews.resultFail", "Fail")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setResult("");
                    }}
                  >
                    {t("common.cancel", "Cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleComplete}
                    disabled={result === ""}
                    className={
                      result === ""
                        ? "opacity-50 pointer-events-none"
                        : undefined
                    }
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
                    onClick={() =>
                      onUpdateStatus({
                        id: interview.id,
                        status: "CANCELLED",
                      })
                    }
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
