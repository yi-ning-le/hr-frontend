import { create } from "zustand";
import { CandidateStatusesAPI } from "@/lib/api";
import type { CandidateStatusDefinition } from "@/types/candidate";
import { toast } from "sonner";

interface CandidateStatusState {
  statuses: CandidateStatusDefinition[];
  isLoading: boolean;
  error: string | null;
  statusMap: Record<string, CandidateStatusDefinition>;

  // Actions
  fetchStatuses: () => Promise<void>;
  createStatus: (
    name: string,
    color: string,
  ) => Promise<CandidateStatusDefinition | void>;
  updateStatus: (data: {
    id: string;
    name: string;
    color: string;
  }) => Promise<CandidateStatusDefinition | void>;
  deleteStatus: (id: string) => Promise<void>;
  reorderStatuses: (ids: string[]) => Promise<void>;
}

export const useCandidateStatusStore = create<CandidateStatusState>(
  (set, get) => ({
    statuses: [],
    isLoading: false,
    error: null,
    statusMap: {},

    fetchStatuses: async () => {
      set({ isLoading: true, error: null });
      try {
        const statuses = await CandidateStatusesAPI.list();
        const statusMap = statuses.reduce(
          (acc, status) => {
            acc[status.slug] = status;
            acc[status.id] = status; // Map by both slug and id for flexibility
            return acc;
          },
          {} as Record<string, CandidateStatusDefinition>,
        );

        set({ statuses, statusMap, isLoading: false });
      } catch (error) {
        console.error(error);
        set({ error: "Failed to fetch statuses", isLoading: false });
      }
    },

    createStatus: async (name, color) => {
      set({ isLoading: true });
      try {
        const newStatus = await CandidateStatusesAPI.create(name, color);
        await get().fetchStatuses(); // Refresh list to get sort order correct and rebuild map
        toast.success("Status created");
        return newStatus;
      } catch (error) {
        console.error(error);
        toast.error("Failed to create status");
        set({ isLoading: false });
      }
    },

    updateStatus: async ({ id, name, color }) => {
      set({ isLoading: true });
      try {
        const updatedStatus = await CandidateStatusesAPI.update(
          id,
          name,
          color,
        );
        await get().fetchStatuses();
        toast.success("Status updated");
        return updatedStatus;
      } catch (error) {
        console.error(error);
        toast.error("Failed to update status");
        set({ isLoading: false });
      }
    },

    deleteStatus: async (id) => {
      set({ isLoading: true });
      try {
        await CandidateStatusesAPI.delete(id);
        await get().fetchStatuses();
        toast.success("Status deleted");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete status");
        set({ isLoading: false });
      }
    },

    reorderStatuses: async (ids) => {
      // Optimistic update
      // We can't easily optimistically reorder full objects without mapping ids back to objects
      // So let's just wait for API. Or do simple reorder if we can.

      try {
        await CandidateStatusesAPI.reorder(ids);
        // Instead of full refetch, we could just re-sort logically, but fetch is safer.
        // Although for drag-and-drop, full fetch might cause flicker.
        // But let's stick to fetch for correctness first.
        await get().fetchStatuses();
      } catch (error) {
        console.error(error);
        toast.error("Failed to reorder statuses");
        // Revert handled by not changing state until fetch
      }
    },
  }),
);
