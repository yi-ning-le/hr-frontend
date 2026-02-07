import { create } from "zustand";

interface JobState {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
}

export const useJobStore = create<JobState>((set) => ({
  isAddDialogOpen: false,
  setIsAddDialogOpen: (isOpen) => set({ isAddDialogOpen: isOpen }),
}));
