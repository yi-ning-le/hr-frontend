import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, Plus } from "lucide-react";
import { CandidateForm, type CandidateFormValues } from "./CandidateForm";
import { useCandidateStore } from "@/stores/useCandidateStore";
import { toast } from "sonner";


export function AddCandidateDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "form">("upload");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<Partial<CandidateFormValues>>({});

  const addCandidate = useCandidateStore((state) => state.addCandidate);

  const resetState = () => {
    setStep("upload");
    setParsedData({});
    setIsParsing(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(resetState, 300); // Reset after transition
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);

    // Simulate parsing delay
    setTimeout(() => {
      // Mock data parsed from "PDF"
      const mockParsedData: Partial<CandidateFormValues> = {
        name: "Mock Candidate",
        email: "mock.candidate@example.com",
        phone: "+1 234 567 8900",
        education: "Bachelor of Science, Mock University",
        experienceYears: 4,
        resumeUrl: URL.createObjectURL(file), // Create a blob URL for preview
      };

      setParsedData(mockParsedData);
      setIsParsing(false);
      setStep("form");
      toast.success("Resume parsed successfully!");
    }, 1500);
  };

  const handleSubmit = (values: CandidateFormValues) => {
    const newCandidate = {
      id: crypto.randomUUID(),
      ...values,
      appliedAt: new Date(),
    };

    addCandidate(newCandidate);
    toast.success("Candidate added successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            {step === "upload"
              ? "Upload a resume to auto-fill candidate details."
              : "Review and edit candidate information."}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 mt-4 transition-colors hover:bg-muted/50">
            {isParsing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Parsing resume...</p>
              </div>
            ) : (
              <>
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Upload Resume</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs">
                  Drag and drop your PDF here, or click to browse.
                </p>
                <div className="relative">
                  <Button variant="outline">Select File</Button>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Button variant="ghost" size="sm" onClick={() => setStep("form")}>
                    Skip Upload
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <CandidateForm
            defaultValues={parsedData}
            onSubmit={handleSubmit}
            onCancel={() => setStep("upload")}
            submitLabel="Add Candidate"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
