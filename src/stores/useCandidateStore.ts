import { create } from "zustand";
import type { Candidate, CandidateStatus } from "@/types/candidate";

import { CandidatesAPI } from "@/lib/api";

interface CandidateState {
  candidates: Candidate[];
  selectedCandidateId: string | null;
  searchQuery: string;
  selectedJobId: string | "all";
  viewMode: "list" | "board";
  statusFilter: CandidateStatus[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCandidates: () => Promise<void>;
  setCandidates: (candidates: Candidate[]) => void;
  addCandidate: (candidate: Partial<Candidate>, file?: File) => Promise<void>;
  updateCandidate: (id: string, updates: Partial<Candidate>) => Promise<void>;
  removeCandidate: (id: string) => Promise<void>;
  updateCandidateStatus: (id: string, status: CandidateStatus) => Promise<void>;
  updateCandidateNote: (id: string, note: string) => Promise<void>;
  uploadResume: (
    id: string,
    file: File,
  ) => Promise<{ resumeUrl: string; candidate: Candidate }>;
  selectCandidate: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedJobId: (id: string | "all") => void;
  setViewMode: (mode: "list" | "board") => void;
  setStatusFilter: (statuses: CandidateStatus[]) => void;
}

export const useCandidateStore = create<CandidateState>((set) => ({
  candidates: [], // Initialize with empty array, fetch on mount
  selectedCandidateId: null,
  searchQuery: "",
  selectedJobId: "all",
  viewMode: "board",
  statusFilter: [],
  isLoading: false,
  error: null,

  fetchCandidates: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch all candidates to maintain stable counts for the sidebar
      const candidates = await CandidatesAPI.list();
      set({ candidates, isLoading: false });
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to fetch candidates", isLoading: false });
    }
  },

  setCandidates: (candidates) => set({ candidates }),

  updateCandidateStatus: async (id, status) => {
    try {
      const updatedCandidate = await CandidatesAPI.updateStatus(id, status);
      set((state) => ({
        candidates: state.candidates.map((c) =>
          c.id === id ? updatedCandidate : c,
        ),
      }));
    } catch (_error) {
      console.error("Failed to update status", _error);
    }
  },

  updateCandidateNote: async (id, note) => {
    try {
      const updatedCandidate = await CandidatesAPI.updateNote(id, note);
      set((state) => ({
        candidates: state.candidates.map((c) =>
          c.id === id ? updatedCandidate : c,
        ),
      }));
    } catch (_error) {
      console.error("Failed to update note", _error);
    }
  },

  selectCandidate: (id) => set({ selectedCandidateId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedJobId: (id) => {
    set({ selectedJobId: id });
    // Removed automatic re-fetch to keep counts stable
  },
  setViewMode: (mode) => set({ viewMode: mode }),
  setStatusFilter: (statuses) => set({ statusFilter: statuses }),

  // CRUD Actions
  addCandidate: async (candidate, file) => {
    set({ isLoading: true, error: null });
    try {
      let newCandidate = await CandidatesAPI.create(candidate);

      if (file) {
        const result = await CandidatesAPI.uploadResume(newCandidate.id, file);
        newCandidate = result.candidate;
      }

      set((state) => ({
        candidates: [newCandidate, ...state.candidates],
        isLoading: false,
      }));
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to create candidate", isLoading: false });
    }
  },

  updateCandidate: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCandidate = await CandidatesAPI.update(id, updates);
      set((state) => ({
        candidates: state.candidates.map((c) =>
          c.id === id ? updatedCandidate : c,
        ),
        isLoading: false,
      }));
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to update candidate", isLoading: false });
    }
  },

  removeCandidate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await CandidatesAPI.delete(id);
      set((state) => ({
        candidates: state.candidates.filter((c) => c.id !== id),
        // If the removed candidate was selected, deselect them
        selectedCandidateId:
          state.selectedCandidateId === id ? null : state.selectedCandidateId,
        isLoading: false,
      }));
    } catch (_error) {
      console.error(_error);
      set({ error: "Failed to delete candidate", isLoading: false });
    }
  },

  uploadResume: async (id, file) => {
    try {
      const { resumeUrl, candidate } = await CandidatesAPI.uploadResume(
        id,
        file,
      );
      set((state) => ({
        candidates: state.candidates.map((c) => (c.id === id ? candidate : c)),
      }));
      return { resumeUrl, candidate };
    } catch (error) {
      console.error("Failed to upload resume");
      throw error;
    }
  },
}));
