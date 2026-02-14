import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Interview } from "@/types/recruitment.d";

interface InterviewScheduleCardProps {
  interview: Interview;
}

export function InterviewScheduleCard({
  interview,
}: InterviewScheduleCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t("recruitment.interviews.schedule")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-10 w-10 text-muted-foreground bg-muted p-2 rounded-md" />
          <div>
            <div className="font-medium">
              {format(new Date(interview.scheduledTime), "EEEE, MMMM d, yyyy")}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("recruitment.interviews.date")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-10 w-10 text-muted-foreground bg-muted p-2 rounded-md" />
          <div>
            <div className="font-medium">
              {(() => {
                const start = new Date(interview.scheduledTime);
                const end = interview.scheduledEndTime
                  ? new Date(interview.scheduledEndTime)
                  : null;

                if (end) {
                  return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
                }
                return format(start, "h:mm a");
              })()}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("recruitment.interviews.time")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
