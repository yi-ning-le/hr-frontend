import { create } from "zustand";
import type { Candidate, CandidateStatus } from "@/types/candidate";

// Mock Data (Moved from CandidateManagement.tsx)
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

interface CandidateState {
  candidates: Candidate[];
  selectedCandidateId: string | null;
  searchQuery: string;
  selectedJobId: string | "all";
  viewMode: "list" | "board";
  statusFilter: CandidateStatus[];

  // Actions
  setCandidates: (candidates: Candidate[]) => void;
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  removeCandidate: (id: string) => void;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
  updateCandidateNote: (id: string, note: string) => void;
  selectCandidate: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedJobId: (id: string | "all") => void;
  setViewMode: (mode: "list" | "board") => void;
  setStatusFilter: (statuses: CandidateStatus[]) => void;
}

export const useCandidateStore = create<CandidateState>((set) => ({
  candidates: MOCK_CANDIDATES, // Initialize with mock data
  selectedCandidateId: null,
  searchQuery: "",
  selectedJobId: "all",
  viewMode: "board",

  statusFilter: [],

  setCandidates: (candidates) => set({ candidates }),

  updateCandidateStatus: (id, status) =>
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, status } : c,
      ),
    })),

  updateCandidateNote: (id, note) =>
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, note } : c,
      ),
    })),

  selectCandidate: (id) => set({ selectedCandidateId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedJobId: (id) => set({ selectedJobId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setStatusFilter: (statuses) => set({ statusFilter: statuses }),

  // CRUD Actions
  addCandidate: (candidate) =>
    set((state) => ({ candidates: [candidate, ...state.candidates] })),

  updateCandidate: (id, updates) =>
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      ),
    })),

  removeCandidate: (id) =>
    set((state) => ({
      candidates: state.candidates.filter((c) => c.id !== id),
      // If the removed candidate was selected, deselect them
      selectedCandidateId:
        state.selectedCandidateId === id ? null : state.selectedCandidateId,
    })),
}));
