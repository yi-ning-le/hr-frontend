import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import type { Notification } from "@/types/notification";
import { formatNotification } from "../formatNotification";

const t = (
  key: string,
  options?: string | { defaultValue?: string; [k: string]: unknown },
) => {
  if (typeof options === "string") {
    return options;
  }
  if (options && typeof options === "object") {
    const template = options.defaultValue ?? key;
    return String(template).replaceAll(/\{\{(\w+)\}\}/g, (_, token: string) => {
      const value = options[token];
      return typeof value === "string" && value !== "" ? value : `{{${token}}}`;
    });
  }
  return key;
};

describe("formatNotification", () => {
  it("formats reviewer assignment notification", () => {
    const notification: Notification = {
      id: "1",
      userId: "6f3e6fd9-7867-4fff-b3f6-27edab0b4973",
      eventType: "candidate_reviewer_assigned",
      subject: {
        type: "candidate",
        id: "11111111-1111-1111-1111-111111111111",
      },
      context: {
        candidateId: "11111111-1111-1111-1111-111111111111",
      },
      content: {
        titleKey: "notifications.events.candidate_reviewer_assigned.title",
        messageKey: "notifications.events.candidate_reviewer_assigned.message",
      },
      action: {
        kind: "candidateReview",
        params: {
          candidateId: "11111111-1111-1111-1111-111111111111",
        },
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const result = formatNotification(notification, t as TFunction);

    expect(result.title).toBe("New Resume Review Assigned");
    expect(result.message).toBe(
      "You have been assigned to review a candidate's resume.",
    );
    expect(result.action).toEqual({
      kind: "candidateReview",
      candidateId: "11111111-1111-1111-1111-111111111111",
    });
  });

  it("formats interview assignment notification", () => {
    const notification: Notification = {
      id: "2",
      userId: "6f3e6fd9-7867-4fff-b3f6-27edab0b4973",
      eventType: "interview_assigned",
      subject: {
        type: "interview",
        id: "12345678-1234-1234-1234-123456789012",
      },
      context: {
        interviewId: "12345678-1234-1234-1234-123456789012",
        candidateId: "11111111-1111-1111-1111-111111111111",
      },
      content: {
        titleKey: "notifications.events.interview_assigned.title",
        messageKey: "notifications.events.interview_assigned.message",
      },
      action: {
        kind: "interviewDetail",
        params: {
          interviewId: "12345678-1234-1234-1234-123456789012",
        },
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const result = formatNotification(notification, t as TFunction);

    expect(result.title).toBe("New Interview Assigned");
    expect(result.message).toBe(
      "You have been assigned to conduct an interview.",
    );
    expect(result.action).toEqual({
      kind: "interviewDetail",
      interviewId: "12345678-1234-1234-1234-123456789012",
    });
  });

  it("falls back gracefully for unknown action kind", () => {
    const notification: Notification = {
      id: "3",
      userId: "6f3e6fd9-7867-4fff-b3f6-27edab0b4973",
      eventType: "future_event",
      subject: {
        type: "other",
        id: "11111111-1111-1111-1111-111111111111",
      },
      content: {
        titleKey: "notifications.events.generic.title",
        messageKey: "notifications.events.generic.message",
      },
      action: { kind: "futureAction" },
      isRead: true,
      createdAt: new Date().toISOString(),
    };

    const result = formatNotification(notification, t as TFunction);
    expect(result.action).toBeNull();
  });

  it("formats review_completed notification", () => {
    const notification: Notification = {
      id: "4",
      userId: "6f3e6fd9-7867-4fff-b3f6-27edab0b4973",
      eventType: "review_completed",
      subject: {
        type: "candidate",
        id: "22222222-2222-2222-2222-222222222222",
      },
      context: {
        candidateId: "22222222-2222-2222-2222-222222222222",
        candidateName: "Jane Doe",
        reviewStatus: "suitable",
        reviewerName: "Alice",
      },
      content: {
        titleKey: "notifications.events.review_completed.title",
        messageKey: "notifications.events.review_completed.message",
        params: {
          candidateName: "Jane Doe",
        },
      },
      action: {
        kind: "candidateReview",
        params: {
          candidateId: "22222222-2222-2222-2222-222222222222",
        },
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const result = formatNotification(notification, t as TFunction);

    expect(result.title).toBe("Resume Review Completed");
    expect(result.message).toBe(
      "A reviewer has submitted their assessment for candidate Jane Doe.",
    );
    expect(result.action).toEqual({
      kind: "reviewFinished",
      candidateId: "22222222-2222-2222-2222-222222222222",
    });
  });

  it("falls back to legacy review_completed message when candidateName is missing", () => {
    const notification: Notification = {
      id: "5",
      userId: "6f3e6fd9-7867-4fff-b3f6-27edab0b4973",
      eventType: "review_completed",
      subject: {
        type: "candidate",
        id: "33333333-3333-3333-3333-333333333333",
      },
      content: {
        titleKey: "notifications.events.review_completed.title",
        messageKey: "notifications.events.review_completed.message",
      },
      action: {
        kind: "candidateReview",
        params: {
          candidateId: "33333333-3333-3333-3333-333333333333",
        },
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const result = formatNotification(notification, t as TFunction);

    expect(result.message).toBe(
      "A reviewer has submitted their assessment for a candidate.",
    );
    expect(result.action).toEqual({
      kind: "reviewFinished",
      candidateId: "33333333-3333-3333-3333-333333333333",
    });
  });

  it("formats interview_completed notification", () => {
    const notification: Notification = {
      id: "6",
      userId: "6f3e6fd9-7867-4fff-b3f6-27edab0b4973",
      eventType: "interview_completed",
      subject: {
        type: "interview",
        id: "44444444-4444-4444-4444-444444444444",
      },
      context: {
        interviewId: "44444444-4444-4444-4444-444444444444",
        candidateId: "11111111-1111-1111-1111-111111111111",
        candidateName: "John Doe",
        interviewerName: "Alice Lee",
      },
      content: {
        titleKey: "notifications.events.interview_completed.title",
        messageKey: "notifications.events.interview_completed.message",
        params: {
          candidateName: "John Doe",
          interviewerName: "Alice Lee",
        },
      },
      action: {
        kind: "interviewCompleted",
        params: {
          candidateId: "11111111-1111-1111-1111-111111111111",
        },
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const result = formatNotification(notification, t as TFunction);

    expect(result.title).toBe("Interview Completed");
    expect(result.message).toBe(
      "Alice Lee has completed the interview for candidate John Doe.",
    );
    expect(result.action).toEqual({
      kind: "interviewCompleted",
      candidateId: "11111111-1111-1111-1111-111111111111",
    });
  });
});
