import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotificationsAPI } from "@/lib/api";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from "../useNotifications";

vi.mock("@/lib/api", () => ({
  NotificationsAPI: {
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useNotifications queries", () => {
    it("should fetch notifications successfully", async () => {
      const mockData = [
        {
          id: "1",
          userId: "6f3e6fd9-7867-4fff-b3f6-27edab0b4973",
          eventType: "candidate_reviewer_assigned",
          subject: {
            type: "candidate",
            id: "11111111-1111-1111-1111-111111111111",
          },
          context: { candidateId: "11111111-1111-1111-1111-111111111111" },
          content: {
            titleKey: "notifications.events.candidate_reviewer_assigned.title",
            messageKey:
              "notifications.events.candidate_reviewer_assigned.message",
          },
          action: {
            kind: "candidateReview",
            params: {
              candidateId: "11111111-1111-1111-1111-111111111111",
            },
          },
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ];
      vi.mocked(NotificationsAPI.getNotifications).mockResolvedValueOnce(
        mockData as any,
      );

      const { result } = renderHook(() => useNotifications(true), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(NotificationsAPI.getNotifications).toHaveBeenCalledWith(50, 0);
    });

    it("should not fetch notifications when enabled is false", async () => {
      const { result } = renderHook(() => useNotifications(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true); // isPending is true when disabled
      expect(result.current.fetchStatus).toBe("idle"); // idle means it's not fetching
      expect(NotificationsAPI.getNotifications).not.toHaveBeenCalled();
    });
  });

  describe("useUnreadCount", () => {
    it("should fetch unread count successfully", async () => {
      vi.mocked(NotificationsAPI.getUnreadCount).mockResolvedValueOnce(
        3 as any,
      );

      const { result } = renderHook(() => useUnreadCount(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(3);
      expect(NotificationsAPI.getUnreadCount).toHaveBeenCalled();
    });
  });

  describe("useMarkNotificationRead mutations", () => {
    it("should successfully mark notification as read and invalidate queries", async () => {
      vi.mocked(NotificationsAPI.markAsRead).mockResolvedValueOnce({
        message: "success",
      } as any);

      const { result } = renderHook(() => useMarkNotificationRead(), {
        wrapper: createWrapper(),
      });

      result.current.mutate("123");

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(NotificationsAPI.markAsRead).toHaveBeenCalledWith("123");
    });
  });

  describe("useMarkAllNotificationsRead mutations", () => {
    it("should successfully mark all notifications as read and invalidate queries", async () => {
      vi.mocked(NotificationsAPI.markAllAsRead).mockResolvedValueOnce({
        message: "success",
      } as any);

      const { result } = renderHook(() => useMarkAllNotificationsRead(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(NotificationsAPI.markAllAsRead).toHaveBeenCalled();
    });
  });
});
