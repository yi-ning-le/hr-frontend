import { create } from "zustand";
import type { CandidateStatus } from "@/types/candidate";

interface CandidateState {
  selectedCandidateId: string | null;
  searchQuery: string;
  selectedJobId: string | "all";
  viewMode: "list" | "board";
  statusFilter: CandidateStatus[];

  // Actions
  selectCandidate: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedJobId: (id: string | "all") => void;
  setViewMode: (mode: "list" | "board") => void;
  setStatusFilter: (statuses: CandidateStatus[]) => void;
}

export const useCandidateStore = create<CandidateState>((set) => ({
  selectedCandidateId: null,
  searchQuery: "",
  selectedJobId: "all",
  viewMode: "board",
  statusFilter: [],

  selectCandidate: (id) => set({ selectedCandidateId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedJobId: (id) => set({ selectedJobId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setStatusFilter: (statuses) => set({ statusFilter: statuses }),
}));
