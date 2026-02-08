import { Loader2, Plus, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateCandidate } from "@/hooks/queries/useCandidates";
import { parseResume } from "@/lib/parseResume";
import { cn } from "@/lib/utils";
import { CandidateForm, type CandidateFormValues } from "./CandidateForm";

export function AddCandidateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "form">("upload");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<Partial<CandidateFormValues>>(
    {},
  );
  const [isDragging, setIsDragging] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { mutateAsync: createCandidate } = useCreateCandidate();

  const resetState = () => {
    setStep("upload");
    setParsedData({});
    setIsParsing(false);
    setIsDragging(false);
    setResumeFile(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(resetState, 300); // Reset after transition
    }
  };

  const processFile = async (file: File) => {
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("recruitment.candidates.dialog.uploadError"));
      return;
    }

    setResumeFile(file);
    setIsParsing(true);

    try {
      const parsed = await parseResume(file);
      setParsedData(parsed);

      const filledFields = Object.keys(parsed).filter(
        (key) => parsed[key as keyof typeof parsed],
      );
      if (filledFields.length > 0) {
        toast.success(
          t("recruitment.candidates.dialog.autoFilled", {
            fields: filledFields.join(", "),
          }),
        );
      } else {
        toast.info(t("recruitment.candidates.dialog.parseError"));
      }
    } catch (error) {
      console.error("Resume parsing error:", error);
      toast.error(t("recruitment.candidates.dialog.parseFailed"));
    } finally {
      setIsParsing(false);
      setStep("form");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async (values: CandidateFormValues) => {
    const newCandidate = {
      ...values,
      appliedAt: new Date(),
    };

    await createCandidate({
      data: newCandidate,
      file: resumeFile || undefined,
    });
    toast.success(t("recruitment.candidates.dialog.addSuccess"));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("recruitment.candidates.add")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {t("recruitment.candidates.dialog.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {step === "upload"
              ? t("recruitment.candidates.dialog.uploadStep")
              : t("recruitment.candidates.dialog.reviewStep")}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" ? (
          <article
            aria-label={t("recruitment.candidates.dialog.uploadResume")}
            className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 mt-4 transition-colors",
              isDragging ? "border-primary bg-primary/10" : "hover:bg-muted/50",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isParsing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t("recruitment.candidates.dialog.parsingResume")}
                </p>
              </div>
            ) : (
              <>
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {t("recruitment.candidates.dialog.uploadResume")}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs">
                  {t("recruitment.candidates.dialog.dragDropHint")}
                </p>
                <div className="relative">
                  <Button variant="outline">
                    {t("recruitment.candidates.dialog.selectFile")}
                  </Button>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep("form")}
                  >
                    {t("recruitment.candidates.dialog.skipUpload")}
                  </Button>
                </div>
              </>
            )}
          </article>
        ) : (
          <CandidateForm
            defaultValues={parsedData}
            onSubmit={handleSubmit}
            onCancel={() => setStep("upload")}
            submitLabel={t("recruitment.candidates.add")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
