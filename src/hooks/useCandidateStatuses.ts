import { useEffect, useRef } from "react";
import { useCandidateStatusStore } from "@/stores/useCandidateStatusStore";

/**
 * Hook to access candidate statuses.
 * Automatically fetches statuses if they are not loaded.
 */
export const useCandidateStatuses = () => {
  const store = useCandidateStatusStore();
  const mounted = useRef(false);

  useEffect(() => {
    // Determine if we need to fetch: empty and not loading.
    // We use a ref to prevent double fetch in Strict Mode dev (though Zustand might handle it, safer to guard)
    if (
      store.statuses.length === 0 &&
      !store.isLoading &&
      !store.error &&
      !mounted.current
    ) {
      mounted.current = true;
      store.fetchStatuses();
    }
  }, [
    store.statuses.length,
    store.isLoading,
    store.error,
    store.fetchStatuses,
    store,
  ]);

  return store;
};
