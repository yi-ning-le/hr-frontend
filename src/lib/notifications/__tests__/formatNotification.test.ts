import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import type { Notification } from "@/types/notification";
import { formatNotification } from "../formatNotification";

const t = (key: string, fallback?: string) => fallback || key;

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
});
