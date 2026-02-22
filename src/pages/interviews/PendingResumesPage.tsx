import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route } from "@/routes/_protected/pending-resumes";
import { PendingCandidatesTab } from "./components/PendingCandidatesTab";
import { ReviewedCandidatesTab } from "./components/ReviewedCandidatesTab";

type CandidateTab = "pending" | "reviewed";

export default function PendingResumesPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { reviewCandidateId, tab } = Route.useSearch();
  const activeTab: CandidateTab = tab === "reviewed" ? "reviewed" : "pending";

  const handleTabChange = (value: string) => {
    const nextTab: CandidateTab = value === "reviewed" ? "reviewed" : "pending";
    navigate({
      search: (prev) => ({ ...prev, tab: nextTab }),
    });
  };

  useEffect(() => {
    // If a candidate is selected for review via URL, ensure we're on the pending tab
    // so the dialog renders correctly inside PendingCandidatesTab
    if (reviewCandidateId && activeTab !== "pending") {
      navigate({
        search: (prev) => ({
          ...prev,
          tab: "pending",
        }),
      });
    }
  }, [reviewCandidateId, activeTab, navigate]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("nav.pendingResumes", "Pending Resumes")}
        </h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="pending" className="px-8">
            {t(
              "recruitment.candidates.pendingListTitle",
              "Candidates to Review",
            )}
          </TabsTrigger>
          <TabsTrigger value="reviewed" className="px-8">
            {t("recruitment.candidates.reviewedListTitle", "Reviewed History")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingCandidatesTab />
        </TabsContent>

        <TabsContent value="reviewed">
          <ReviewedCandidatesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
