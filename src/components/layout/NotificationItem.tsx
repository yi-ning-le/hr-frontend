import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  formatNotification,
  type NotificationAction,
} from "@/lib/notifications/formatNotification";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  isRecruiter?: boolean;
  isInterviewer?: boolean;
  onRead: (id: string) => void;
  onViewDetails: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  notification,
  isRecruiter = false,
  isInterviewer = false,
  onRead,
  onViewDetails,
  onDelete,
}: NotificationItemProps) {
  const { t } = useTranslation();
  const formatted = formatNotification(notification, t);
  const detailTarget = resolveDetailTarget(
    formatted.action,
    isRecruiter,
    isInterviewer,
  );

  return (
    <article
      aria-label={formatted.title}
      className={cn(
        "group w-full text-left flex flex-col items-start gap-1 border-b border-slate-100 p-4 text-sm transition-colors hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/50",
        !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/10",
      )}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <button
          type="button"
          aria-label={formatted.title}
          onClick={() => {
            if (!notification.isRead) {
              onRead(notification.id);
            }
          }}
          className={cn(
            "font-medium leading-none text-left hover:underline",
            !notification.isRead
              ? "text-slate-900 dark:text-white"
              : "text-slate-700 dark:text-slate-300",
          )}
        >
          {formatted.title}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <span className="whitespace-nowrap text-[10px] text-slate-500">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
          <button
            type="button"
            aria-label={t("notifications.delete", "Delete notification")}
            className="hidden group-hover:inline-flex items-center justify-center size-5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
            onClick={() => {
              onDelete(notification.id);
            }}
          >
            <X className="size-3" />
          </button>
        </div>
      </div>
      <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
        {formatted.message}
      </p>
      {detailTarget && (
        <Link
          to={detailTarget.to}
          params={detailTarget.params}
          search={detailTarget.search}
          className="mt-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          onClick={() => {
            onViewDetails(notification);
          }}
        >
          {t("notifications.viewDetails", "View details")}
        </Link>
      )}
    </article>
  );
}

type NotificationDetailTarget =
  | {
      to: "/pending-resumes";
      search: {
        tab: "pending";
        reviewCandidateId: string;
      };
      params?: undefined;
    }
  | {
      to: "/recruitment";
      search: {
        tab: "candidates";
        candidateId: string;
        showResume: true;
      };
      params?: undefined;
    }
  | {
      to: "/interviews/$interviewId";
      params: { interviewId: string };
      search?: undefined;
    };

function resolveDetailTarget(
  action: NotificationAction | null,
  isRecruiter: boolean,
  isInterviewer: boolean,
): NotificationDetailTarget | null {
  if (!action || (!isRecruiter && !isInterviewer)) {
    return null;
  }

  if (action.kind === "candidateReview") {
    return {
      to: "/pending-resumes",
      search: {
        tab: "pending",
        reviewCandidateId: action.candidateId,
      },
    };
  }

  if (action.kind === "reviewFinished") {
    if (isRecruiter) {
      return {
        to: "/recruitment",
        search: {
          tab: "candidates",
          candidateId: action.candidateId,
          showResume: true,
        },
      };
    }
    return {
      to: "/pending-resumes",
      search: {
        tab: "pending",
        reviewCandidateId: action.candidateId,
      },
    };
  }

  if (action.kind === "interviewDetail") {
    return {
      to: "/interviews/$interviewId",
      params: { interviewId: action.interviewId },
    };
  }

  if (action.kind === "interviewCompleted") {
    if (isRecruiter) {
      return {
        to: "/recruitment",
        search: {
          tab: "candidates",
          candidateId: action.candidateId,
          showResume: true,
        },
      };
    }
    return null;
  }

  return null;
}
