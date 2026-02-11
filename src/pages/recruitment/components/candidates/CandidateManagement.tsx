import type { DropResult } from "@hello-pangea/dnd";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  useCandidateCounts,
  useCandidates,
  useUpdateCandidateStatus,
} from "@/hooks/queries/useCandidates";
import { useJobs } from "@/hooks/queries/useJobs";
import { Route } from "@/routes/_protected/recruitment";
import type { CandidateStatus } from "@/types/candidate";
import { CandidateDetail } from "./CandidateDetail";
import {
  CandidateKanban,
  UNKNOWN_CANDIDATE_STATUS_SLUG,
} from "./CandidateKanban";
import { CandidateList } from "./CandidateList";
import { CandidateToolbar } from "./CandidateToolbar";
import { JobSidebar } from "./JobSidebar";

export function CandidateManagement() {
  const { t } = useTranslation();
  const { data: jobs = [] } = useJobs();
  const { data: jobCounts = {} } = useCandidateCounts();

  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  // State from URL
  const selectedJobId = search.jobId || "all";
  const searchQuery = search.q || "";
  const selectedCandidateId = search.candidateId;
  const viewMode = search.view || "board";
  const statusFilter = search.status || [];
  const page = search.page || 1;
  const limit = search.limit || (viewMode === "list" ? 50 : 1000);

  // Actions
  const { mutate: updateCandidateStatus } = useUpdateCandidateStatus();

  const { data: candidateData } = useCandidates({
    jobId: selectedJobId === "all" ? undefined : selectedJobId,
    q: searchQuery,
    status: statusFilter.length > 0 ? statusFilter[0] : undefined, // Currently API only supports single status filter
    page,
    limit,
  });

  const candidates = candidateData?.data || [];
  const total = candidateData?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const setSelectedJobId = (id: string) =>
    navigate({
      search: (prev) => ({ ...prev, jobId: id, page: 1 }),
      replace: true,
    });

  const setSearchQuery = (q: string) =>
    navigate({ search: (prev) => ({ ...prev, q, page: 1 }), replace: true });

  const selectCandidate = (id: string | null) =>
    navigate({
      search: (prev) => ({ ...prev, candidateId: id || undefined }),
      replace: true,
    });

  const setViewMode = (mode: "list" | "board") =>
    navigate({
      search: (prev) => ({ ...prev, view: mode, page: 1 }),
      replace: true,
    });

  const setStatusFilter = (statuses: CandidateStatus[]) =>
    navigate({
      search: (prev) => ({ ...prev, status: statuses, page: 1 }),
      replace: true,
    });

  const setPage = (p: number) =>
    navigate({ search: (prev) => ({ ...prev, page: p }), replace: true });

  // Filter out closed jobs for sidebar
  const openJobs = useMemo(
    () => jobs.filter((j) => j.status === "OPEN"),
    [jobs],
  );

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (destination.droppableId === UNKNOWN_CANDIDATE_STATUS_SLUG) {
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
        totalCandidates={
          selectedJobId === "all" ? total : jobCounts[selectedJobId] || 0
        }
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

        <div className="flex-1 overflow-hidden p-4 pt-2 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {viewMode === "list" ? (
              <CandidateList
                candidates={candidates}
                onCandidateClick={(c) => selectCandidate(c.id)}
              />
            ) : (
              <CandidateKanban
                candidates={candidates}
                onDragEnd={handleDragEnd}
                onCandidateClick={(c) => selectCandidate(c.id)}
              />
            )}
          </div>

          {viewMode === "list" && totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                      aria-disabled={page <= 1}
                      className={
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === page}
                          onClick={() => setPage(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      aria-disabled={page >= totalPages}
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      <Dialog
        open={!!selectedCandidateId}
        onOpenChange={(open: boolean) => !open && selectCandidate(null)}
      >
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
          {selectedCandidateId && (
            <CandidateDetail
              candidateId={selectedCandidateId}
              onClose={() => selectCandidate(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
