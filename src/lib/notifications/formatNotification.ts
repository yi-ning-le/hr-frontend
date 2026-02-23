import type { TFunction } from "i18next";
import type { Notification } from "@/types/notification";

export type NotificationAction =
  | { kind: "candidateReview"; candidateId: string }
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
  const fallbackTitle = t("notifications.events.generic.title", "Notification");
  const fallbackMessage = t(
    "notifications.events.generic.message",
    "You have a new notification.",
  );

  const title = t(
    notification.content.titleKey,
    getTitleFallback(notification.content.titleKey, fallbackTitle),
  );
  const message = t(
    notification.content.messageKey,
    getMessageFallback(notification.content.messageKey, fallbackMessage),
  );

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

  if (action.kind === "candidateReview") {
    const candidateId =
      getStringParam(action.params, "candidateId") ??
      (notification.subject.type === "candidate"
        ? notification.subject.id
        : null);
    return candidateId ? { kind: "candidateReview", candidateId } : null;
  }

  // review_completed notifications also use candidateReview action
  // (handled by the candidateReview branch above)

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
    return "A reviewer has submitted their assessment for a candidate.";
  }
  return generic;
}
