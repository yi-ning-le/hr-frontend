import { useState } from "react";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfPreview } from "../PdfPreview";
import type { Candidate } from "@/types/candidate";
import { cn } from "@/lib/utils";

interface CandidateResumeSectionProps {
  candidate: Candidate;
  isUploadingResume: boolean;
  onResumeUpload: (file: File) => void;
  onPreviewClick: () => void;
}

export function CandidateResumeSection({
  candidate,
  isUploadingResume,
  onResumeUpload,
  onPreviewClick,
}: CandidateResumeSectionProps) {
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
      onResumeUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onResumeUpload(file);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <FileText className="h-4 w-4" /> 简历预览
        </h4>
        <div className="flex gap-2">
          {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => window.open(candidate.resumeUrl, "_blank")}
            >
              下载简历
            </Button>
          ) : null}
        </div>
      </div>
      {candidate.resumeUrl && candidate.resumeUrl !== "#" ? (
        <div
          onClick={onPreviewClick}
          className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all rounded-xl"
        >
          <PdfPreview
            url={candidate.resumeUrl}
            maxHeight="300px"
            showToolbar={false}
            initialScale={0.8}
          />
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "rounded-xl border p-8 text-center text-sm text-muted-foreground min-h-[200px] flex flex-col items-center justify-center border-dashed relative transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 ring-4 ring-primary/10"
              : "bg-slate-50/50 dark:bg-slate-900/50 border-muted-foreground/20 hover:bg-muted/50"
          )}
        >
          {isUploadingResume ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Uploading resume...</p>
            </div>
          ) : (
            <>
              <UploadCloud
                className={cn(
                  "h-10 w-10 mb-3 transition-colors",
                  isDragging ? "text-primary opacity-100" : "opacity-20"
                )}
              />
              <p className="font-medium mb-1">
                {isDragging ? "Drop to upload" : "暂无简历文件"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Click to upload or drag and drop
              </p>
              <Button
                variant={isDragging ? "default" : "outline"}
                size="sm"
                className="relative"
              >
                Upload Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </Button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
