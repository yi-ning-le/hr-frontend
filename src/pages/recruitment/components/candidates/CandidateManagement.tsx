import { useMemo, useEffect } from "react";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import type { DropResult } from "@hello-pangea/dnd";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { type CandidateStatus } from "@/types/candidate";

import { JobSidebar } from "./JobSidebar";
import { CandidateToolbar } from "./CandidateToolbar";
import { CandidateList } from "./CandidateList";
import { CandidateDetail } from "./CandidateDetail";
import { CandidateKanban } from "./CandidateKanban";

import { useCandidateStore } from "@/stores/useCandidateStore";

import { useJobStore } from "@/stores/useJobStore";

export function CandidateManagement() {
  const jobs = useJobStore((state) => state.jobs);


  // Use selectors to avoid unnecessary re-renders
  const candidates = useCandidateStore((state) => state.candidates);
  const selectedJobId = useCandidateStore((state) => state.selectedJobId);
  const searchQuery = useCandidateStore((state) => state.searchQuery);
  const selectedCandidateId = useCandidateStore((state) => state.selectedCandidateId);
  const viewMode = useCandidateStore((state) => state.viewMode);
  const statusFilter = useCandidateStore((state) => state.statusFilter);

  // Actions
  const updateCandidateStatus = useCandidateStore((state) => state.updateCandidateStatus);
  const selectCandidate = useCandidateStore((state) => state.selectCandidate);
  const setSearchQuery = useCandidateStore((state) => state.setSearchQuery);
  const setSelectedJobId = useCandidateStore((state) => state.setSelectedJobId);
  const setViewMode = useCandidateStore((state) => state.setViewMode);
  const setStatusFilter = useCandidateStore((state) => state.setStatusFilter);
  const fetchCandidates = useCandidateStore((state) => state.fetchCandidates);
  const fetchJobs = useJobStore((state) => state.fetchJobs);

  useEffect(() => {
    fetchCandidates();
    fetchJobs();
  }, [fetchCandidates, fetchJobs]);

  // Derived state
  const selectedCandidate = useMemo(() =>
    candidates.find((c) => c.id === selectedCandidateId) || null,
    [candidates, selectedCandidateId]
  );

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesJob =
        selectedJobId === "all" || candidate.appliedJobId === selectedJobId;
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(candidate.status);
      return matchesJob && matchesSearch && matchesStatus;
    });
  }, [candidates, selectedJobId, searchQuery, statusFilter]);

  // Aggregate counts
  const jobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach((c) => {
      counts[c.appliedJobId] = (counts[c.appliedJobId] || 0) + 1;
    });
    return counts;
  }, [candidates]);

  const totalCandidates = candidates.length;

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
    updateCandidateStatus(draggableId, newStatus);
  };

  return (
    <div className="flex h-[calc(100vh-200px)] rounded-lg border bg-background shadow-sm overflow-hidden">
      {/* Sidebar - Job List */}
      <JobSidebar
        jobs={jobs}
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
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as "list" | "board")}>
            <ToggleGroupItem value="list" aria-label="List View">
              <ListIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="board" aria-label="Kanban View">
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
          {selectedCandidate && (
            <CandidateDetail />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
