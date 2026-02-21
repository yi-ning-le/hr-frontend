import { Bell, Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from "@/hooks/queries/useNotifications";
import type { Notification } from "@/types/notification";
import { NotificationList } from "./NotificationList";

export function NotificationBell() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: notifications = [], isLoading } = useNotifications(isOpen);

  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  const handleRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleViewDetails = (notification: Notification) => {
    setIsOpen(false);
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={t("notifications.title", "Notifications")}
        >
          <Bell className="size-5 text-slate-600 dark:text-slate-400" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3 border-slate-200 dark:border-slate-800">
          <h4 className="font-semibold text-sm">
            {t("notifications.title", "Notifications")}
          </h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <Check className="mr-1 size-3" />
              {t("notifications.markAllAsRead", "Mark all as read")}
            </Button>
          )}
        </div>

        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          onRead={handleRead}
          onViewDetails={handleViewDetails}
        />
      </PopoverContent>
    </Popover>
  );
}
