import { Bell, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Notification } from "@/types/notification";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onRead: (id: string) => void;
  onViewDetails: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export function NotificationList({
  notifications,
  isLoading,
  onRead,
  onViewDetails,
  onDelete,
}: NotificationListProps) {
  const { t } = useTranslation();

  return (
    <ScrollArea className="h-[300px]">
      {isLoading ? (
        <div className="flex h-full items-center justify-center p-4">
          <Loader2 className="size-5 animate-spin text-slate-400" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-sm text-slate-500">
          <Bell className="mb-2 size-8 text-slate-300 dark:text-slate-700" />
          <p>{t("notifications.empty", "No notifications")}</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={onRead}
              onViewDetails={onViewDetails}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
