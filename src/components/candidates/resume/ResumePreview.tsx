import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ResumePreviewProps {
  onClick: () => void;
}

export function ResumePreview({ onClick }: ResumePreviewProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-full text-left"
      type="button"
    >
      <div className="flex flex-col items-center justify-center h-48 rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 p-6 text-center text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
        <FileText className="mb-2 h-10 w-10 text-primary opacity-80" />
        <p className="font-medium text-foreground">
          {t("recruitment.candidates.detail.viewResume")}
        </p>
        <p className="text-xs mt-1">
          {t("recruitment.candidates.detail.clickToPreview")}
        </p>
      </div>
    </button>
  );
}
