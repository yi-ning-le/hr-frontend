import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";

const HEARTBEAT_INTERVAL = 3 * 60 * 1000; // 3 minutes

export const useAuthHeartbeat = () => {
  const { user } = useAuthStore();

  useQuery({
    queryKey: ["auth-heartbeat"],
    queryFn: async () => {
      await api.get("/auth/ping");
      return true;
    },
    enabled: !!user,
    refetchInterval: HEARTBEAT_INTERVAL,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
