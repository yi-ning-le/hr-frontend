import { Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResumeUploaderProps {
  isUploading: boolean;
  onUpload: (file: File) => void;
}

export function ResumeUploader({ isUploading, onUpload }: ResumeUploaderProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <section
      aria-label={t("recruitment.candidates.detail.noResume")}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "rounded-xl border p-8 text-center text-sm text-muted-foreground min-h-[200px] flex flex-col items-center justify-center border-dashed relative transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
          : "bg-slate-50/50 dark:bg-slate-900/50 border-muted-foreground/20 hover:bg-muted/50",
      )}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>{t("recruitment.candidates.detail.uploadingResume")}</p>
        </div>
      ) : (
        <>
          <UploadCloud
            className={cn(
              "h-10 w-10 mb-3 transition-colors",
              isDragging ? "text-primary opacity-100" : "opacity-20",
            )}
          />
          <p className="font-medium mb-1">
            {isDragging
              ? t("recruitment.candidates.detail.dropToUpload")
              : t("recruitment.candidates.detail.noResume")}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {t("recruitment.candidates.detail.uploadHint")}
          </p>
          <Button
            variant={isDragging ? "default" : "outline"}
            size="sm"
            className="relative"
          >
            {t("recruitment.candidates.detail.uploadResume")}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </Button>
        </>
      )}
    </section>
  );
}
