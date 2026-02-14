import { Briefcase, FileText, MapPin, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Candidate } from "@/types/candidate";

interface InterviewCandidateCardProps {
  candidate?: Candidate;
  statusDef: { name: string; color: string } | null;
  onPreviewResume: () => void;
}

export function InterviewCandidateCard({
  candidate,
  statusDef,
  onPreviewResume,
}: InterviewCandidateCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          {t("recruitment.candidates.detail.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">
            {t("common.name")}
          </div>
          <div className="text-lg font-semibold flex items-center gap-2">
            {candidate?.name || t("common.unknown")}
            {statusDef && (
              <Badge
                variant="outline"
                style={{
                  borderColor: statusDef.color,
                  color: statusDef.color,
                }}
                className="text-xs px-2 py-0.5"
              >
                {statusDef.name}
              </Badge>
            )}
          </div>
        </div>
        <Separator />
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {t("recruitment.jobs.title")}
          </div>
          <div>{candidate?.appliedJobTitle}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {t("common.contact")}
          </div>
          <div className="text-sm">{candidate?.email}</div>
          <div className="text-sm">{candidate?.phone}</div>
        </div>
      </CardContent>
      {candidate?.resumeUrl && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={onPreviewResume}
          >
            <FileText className="h-4 w-4 mr-2" />
            {t("recruitment.candidates.detail.viewResume", "View Resume")}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
