import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onViewDetails: (notification: Notification) => void;
}

export function NotificationItem({
  notification,
  onRead,
  onViewDetails,
}: NotificationItemProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-label={notification.title}
      className={cn(
        "w-full text-left flex flex-col items-start gap-1 border-b border-slate-100 p-4 text-sm transition-colors hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/50",
        !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/10",
      )}
      onClick={() => {
        if (!notification.isRead) {
          onRead(notification.id);
        }
      }}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <span
          className={cn(
            "font-medium leading-none",
            !notification.isRead
              ? "text-slate-900 dark:text-white"
              : "text-slate-700 dark:text-slate-300",
          )}
        >
          {notification.title}
        </span>
        <span className="whitespace-nowrap text-[10px] text-slate-500">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
      <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
        {notification.message}
      </p>
      {notification.linkUrl && (
        <Link
          to={notification.linkUrl as string & {}}
          className="mt-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(notification);
          }}
        >
          {t("notifications.viewDetails", "View details")}
        </Link>
      )}
    </button>
  );
}
