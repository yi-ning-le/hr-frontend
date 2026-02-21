import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsAPI } from "@/lib/api";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];
export const UNREAD_COUNT_QUERY_KEY = ["notifications", "unread-count"];

export const useNotifications = (enabled = true, limit = 50, offset = 0) => {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, limit, offset],
    queryFn: () => NotificationsAPI.getNotifications(limit, offset),
    enabled,
    staleTime: 0, // Ensure it always fetches when becoming enabled again
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: UNREAD_COUNT_QUERY_KEY,
    queryFn: () => NotificationsAPI.getUnreadCount(),
    refetchInterval: 30000, // optionally poll every 30s
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NotificationsAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => NotificationsAPI.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};
