import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Users, Mail, Phone } from "lucide-react";
import type { Candidate } from "@/types/candidate";

interface CandidateInfoSectionProps {
  candidate: Candidate;
}

export function CandidateInfoSection({ candidate }: CandidateInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <section>
      <h4 className="mb-4 text-sm font-semibold text-muted-foreground flex items-center gap-2">
        <Users className="h-4 w-4" /> {t("recruitment.candidates.detail.basicInfo")}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">{t("recruitment.candidates.detail.email")}</label>
          <div className="flex items-center gap-2 font-medium">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {candidate.email}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">{t("recruitment.candidates.detail.phone")}</label>
          <div className="flex items-center gap-2 font-medium">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {candidate.phone}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">{t("recruitment.candidates.detail.education")}</label>
          <div className="font-medium">{candidate.education}</div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">{t("recruitment.candidates.detail.appliedAt")}</label>
          <div className="font-medium">
            {format(new Date(candidate.appliedAt), "yyyy-MM-dd HH:mm")}
          </div>
        </div>
      </div>
    </section>
  );
}
