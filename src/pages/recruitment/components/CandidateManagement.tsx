import { useState, useMemo } from "react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import type { JobPosition } from "@/types/job";
import type { Candidate } from "@/types/candidate";

import { JobSidebar } from "./candidate/JobSidebar";
import { CandidateToolbar } from "./candidate/CandidateToolbar";
import { CandidateList } from "./candidate/CandidateList";
import { CandidateDetail } from "./candidate/CandidateDetail";

// Mock Data
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "c1",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "+1 (555) 123-4567",
    experienceYears: 5,
    education: "Master in CS, Stanford",
    appliedJobId: "1",
    appliedJobTitle: "高级前端工程师",
    channel: "LinkedIn",
    resumeUrl: "#",
    status: "screening",
    note: "Great experience with React.",
    appliedAt: new Date("2024-05-10"),
  },
  {
    id: "c2",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+1 (555) 987-6543",
    experienceYears: 3,
    education: "Bachelor in Design, RISD",
    appliedJobId: "2",
    appliedJobTitle: "产品经理",
    channel: "Referral",
    resumeUrl: "#",
    status: "interview",
    note: "Strong portfolio.",
    appliedAt: new Date("2024-05-12"),
  },
  {
    id: "c3",
    name: "Mike Chen",
    email: "mike.chen@example.com",
    phone: "+86 138-1234-5678",
    experienceYears: 7,
    education: "Bachelor in CS, Tsinghua",
    appliedJobId: "1",
    appliedJobTitle: "高级前端工程师",
    channel: "Official Site",
    resumeUrl: "#",
    status: "new",
    note: "",
    appliedAt: new Date("2024-05-14"),
  },
];

interface CandidateManagementProps {
  jobs: JobPosition[];
}

export function CandidateManagement({ jobs }: CandidateManagementProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  const filteredCandidates = useMemo(() => {
    return MOCK_CANDIDATES.filter((candidate) => {
      const matchesJob =
        selectedJobId === "all" || candidate.appliedJobId === selectedJobId;
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesJob && matchesSearch;
    });
  }, [selectedJobId, searchQuery]);

  // Aggregate counts
  const jobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_CANDIDATES.forEach((c) => {
      counts[c.appliedJobId] = (counts[c.appliedJobId] || 0) + 1;
    });
    return counts;
  }, []);

  const totalCandidates = MOCK_CANDIDATES.length;

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

      {/* Main Content - Candidate List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <CandidateToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <CandidateList
          candidates={filteredCandidates}
          onCandidateClick={setSelectedCandidate}
        />
      </div>

      {/* Candidate Detail Modal */}
      <Dialog
        open={!!selectedCandidate}
        onOpenChange={(open: boolean) => !open && setSelectedCandidate(null)}
      >
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
          {selectedCandidate && (
            <CandidateDetail candidate={selectedCandidate} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
