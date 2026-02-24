import type { TFunction } from "i18next";
import type { Notification } from "@/types/notification";

export type NotificationAction =
  | { kind: "candidateReview"; candidateId: string }
  | { kind: "reviewFinished"; candidateId: string }
  | { kind: "interviewDetail"; interviewId: string };

export interface FormattedNotification {
  title: string;
  message: string;
  action: NotificationAction | null;
}

export function formatNotification(
  notification: Notification,
  t: TFunction,
): FormattedNotification {
  const contentParams = notification.content.params;
  const fallbackTitle = t("notifications.events.generic.title", "Notification");
  const fallbackMessage = t(
    "notifications.events.generic.message",
    "You have a new notification.",
  );
  const messageKey = getMessageKey(notification);

  const title = t(notification.content.titleKey, {
    ...contentParams,
    defaultValue: getTitleFallback(
      notification.content.titleKey,
      fallbackTitle,
    ),
  });
  const message = t(messageKey, {
    ...contentParams,
    defaultValue: getMessageFallback(messageKey, fallbackMessage),
  });

  return {
    title,
    message,
    action: resolveAction(notification),
  };
}

function resolveAction(notification: Notification): NotificationAction | null {
  const action = notification.action;
  if (!action) {
    return null;
  }

  if (action.kind === "reviewFinished") {
    const candidateId =
      getStringParam(action.params, "candidateId") ??
      (notification.subject.type === "candidate"
        ? notification.subject.id
        : null);
    return candidateId ? { kind: "reviewFinished", candidateId } : null;
  }

  if (action.kind === "candidateReview") {
    const candidateId =
      getStringParam(action.params, "candidateId") ??
      (notification.subject.type === "candidate"
        ? notification.subject.id
        : null);

    if (!candidateId) {
      return null;
    }

    // Distinguish between assigned review and finished review
    if (notification.eventType === "review_completed") {
      return { kind: "reviewFinished", candidateId };
    }
    return { kind: "candidateReview", candidateId };
  }

  if (action.kind === "interviewDetail") {
    const interviewId =
      getStringParam(action.params, "interviewId") ??
      (notification.subject.type === "interview"
        ? notification.subject.id
        : null);
    return interviewId ? { kind: "interviewDetail", interviewId } : null;
  }

  return null;
}

function getMessageKey(notification: Notification): string {
  const messageKey = notification.content.messageKey;
  if (
    messageKey === "notifications.events.review_completed.message" &&
    !getStringParam(notification.content.params, "candidateName")
  ) {
    return "notifications.events.review_completed.message_without_name";
  }
  return messageKey;
}

function getStringParam(
  params: Record<string, unknown> | undefined,
  key: string,
): string | null {
  if (!params) {
    return null;
  }
  const value = params[key];
  return typeof value === "string" && value !== "" ? value : null;
}

function getTitleFallback(key: string, generic: string): string {
  if (key === "notifications.events.candidate_reviewer_assigned.title") {
    return "New Resume Review Assigned";
  }
  if (key === "notifications.events.interview_assigned.title") {
    return "New Interview Assigned";
  }
  if (key === "notifications.events.review_completed.title") {
    return "Resume Review Completed";
  }
  return generic;
}

function getMessageFallback(key: string, generic: string): string {
  if (key === "notifications.events.candidate_reviewer_assigned.message") {
    return "You have been assigned to review a candidate's resume.";
  }
  if (key === "notifications.events.interview_assigned.message") {
    return "You have been assigned to conduct an interview.";
  }
  if (key === "notifications.events.review_completed.message") {
    return "A reviewer has submitted their assessment for candidate {{candidateName}}.";
  }
  if (key === "notifications.events.review_completed.message_without_name") {
    return "A reviewer has submitted their assessment for a candidate.";
  }
  return generic;
}
