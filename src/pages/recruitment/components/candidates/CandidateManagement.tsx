import type { DropResult } from "@hello-pangea/dnd";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  useCandidates,
  useUpdateCandidateStatus,
} from "@/hooks/queries/useCandidates";
import { useJobs } from "@/hooks/queries/useJobs";
import { useCandidateStore } from "@/stores/useCandidateStore";
import type { Candidate, CandidateStatus } from "@/types/candidate";
import { CandidateDetail } from "./CandidateDetail";
import { CandidateKanban } from "./CandidateKanban";
import { CandidateList } from "./CandidateList";
import { CandidateToolbar } from "./CandidateToolbar";
import { JobSidebar } from "./JobSidebar";

export function CandidateManagement() {
  const { t } = useTranslation();
  const { data: jobs = [] } = useJobs();
  const { data: candidates = [] } = useCandidates();

  // Use selectors to avoid unnecessary re-renders
  const selectedJobId = useCandidateStore((state) => state.selectedJobId);
  const searchQuery = useCandidateStore((state) => state.searchQuery);
  const selectedCandidateId = useCandidateStore(
    (state) => state.selectedCandidateId,
  );
  const viewMode = useCandidateStore((state) => state.viewMode);
  const statusFilter = useCandidateStore((state) => state.statusFilter);

  // Actions
  const { mutate: updateCandidateStatus } = useUpdateCandidateStatus();
  const selectCandidate = useCandidateStore((state) => state.selectCandidate);
  const setSearchQuery = useCandidateStore((state) => state.setSearchQuery);
  const setSelectedJobId = useCandidateStore((state) => state.setSelectedJobId);
  const setViewMode = useCandidateStore((state) => state.setViewMode);
  const setStatusFilter = useCandidateStore((state) => state.setStatusFilter);

  // Filter out closed jobs and their candidates
  const openJobs = useMemo(
    () => jobs.filter((j) => j.status === "OPEN"),
    [jobs],
  );

  const candidatesInOpenJobs = useMemo(() => {
    const openJobIds = new Set(openJobs.map((j) => j.id));
    return candidates.filter((c) => openJobIds.has(c.appliedJobId));
  }, [candidates, openJobs]);

  // Derived state for the main view
  const selectedCandidate = useMemo(
    () =>
      candidatesInOpenJobs.find((c) => c.id === selectedCandidateId) || null,
    [candidatesInOpenJobs, selectedCandidateId],
  );

  const filteredCandidates = useMemo(() => {
    return candidatesInOpenJobs.filter((candidate: Candidate) => {
      const matchesJob =
        selectedJobId === "all" || candidate.appliedJobId === selectedJobId;
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(candidate.status);

      return matchesJob && matchesSearch && matchesStatus;
    });
  }, [candidatesInOpenJobs, selectedJobId, searchQuery, statusFilter]);

  // Aggregate counts based on OPEN jobs only
  const jobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    candidatesInOpenJobs.forEach((c: Candidate) => {
      counts[c.appliedJobId] = (counts[c.appliedJobId] || 0) + 1;
    });
    return counts;
  }, [candidatesInOpenJobs]);

  const totalCandidates = candidatesInOpenJobs.length;

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as CandidateStatus;
    updateCandidateStatus({ id: draggableId, status: newStatus });
  };

  return (
    <div className="flex h-[calc(100vh-200px)] rounded-lg border bg-background shadow-sm overflow-hidden">
      {/* Sidebar - Job List */}
      <JobSidebar
        jobs={openJobs}
        selectedJobId={selectedJobId}
        onSelectJob={setSelectedJobId}
        jobCounts={jobCounts}
        totalCandidates={totalCandidates}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 pb-0">
          <div className="flex-1 mr-4">
            <CandidateToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => v && setViewMode(v as "list" | "board")}
          >
            <ToggleGroupItem
              value="list"
              aria-label={t("recruitment.candidates.viewMode.list")}
            >
              <ListIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="board"
              aria-label={t("recruitment.candidates.viewMode.board")}
            >
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex-1 overflow-hidden p-4 pt-2">
          {viewMode === "list" ? (
            <CandidateList
              candidates={filteredCandidates}
              onCandidateClick={(c) => selectCandidate(c.id)}
            />
          ) : (
            <CandidateKanban
              candidates={filteredCandidates}
              onDragEnd={handleDragEnd}
              onCandidateClick={(c) => selectCandidate(c.id)}
            />
          )}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      <Dialog
        open={!!selectedCandidate}
        onOpenChange={(open: boolean) => !open && selectCandidate(null)}
      >
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
          {selectedCandidate && <CandidateDetail />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
