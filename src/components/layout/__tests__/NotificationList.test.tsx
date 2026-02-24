// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Notification } from "@/types/notification";
import { NotificationList } from "../NotificationList";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (
      key: string,
      options?: string | { defaultValue?: string; [k: string]: unknown },
    ) => {
      if (typeof options === "string") {
        return options;
      }
      if (options && typeof options === "object") {
        return options.defaultValue || key;
      }
      return key;
    },
  }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
    search,
    className,
  }: {
    children: React.ReactNode;
    to: string;
    params?: Record<string, string>;
    search?: Record<string, unknown>;
    className?: string;
  }) => {
    let href = to;
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        href = href.replace(`$${key}`, value);
      }
    }
    if (search) {
      const query = new URLSearchParams(
        Object.entries(search)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)]),
      ).toString();
      if (query) {
        href = `${href}?${query}`;
      }
    }

    return (
      <a href={href} className={className} data-testid="router-link">
        {children}
      </a>
    );
  },
}));

vi.mock("date-fns", () => ({
  formatDistanceToNow: vi.fn(() => "5 minutes ago"),
}));

// Mock ResizeObserver for ScrollArea component
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as typeof globalThis.ResizeObserver;

const mockNotifications: Notification[] = [
  {
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
  },
  {
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
    isRead: true,
    createdAt: new Date().toISOString(),
  },
];

describe("NotificationList", () => {
  it("renders loading state when isLoading is true", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationList
        notifications={[]}
        isLoading={true}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={vi.fn()}
      />,
    );

    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("renders empty state when no notifications", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationList
        notifications={[]}
        isLoading={false}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
  });

  it("renders list of notifications", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationList
        notifications={mockNotifications}
        isLoading={false}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("New Resume Review Assigned")).toBeInTheDocument();
    expect(screen.getByText("New Interview Assigned")).toBeInTheDocument();
  });

  it("renders notification messages", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationList
        notifications={mockNotifications}
        isLoading={false}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        "You have been assigned to review a candidate's resume.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You have been assigned to conduct an interview."),
    ).toBeInTheDocument();
  });

  it("does not render empty state when loading", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationList
        notifications={[]}
        isLoading={true}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.queryByText(/no notifications/i)).not.toBeInTheDocument();
  });

  it("passes correct props to NotificationItem", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationList
        notifications={mockNotifications}
        isLoading={false}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={vi.fn()}
      />,
    );

    const unreadNotification = screen.getByRole("button", {
      name: "New Resume Review Assigned",
    });
    unreadNotification.click();

    expect(onRead).toHaveBeenCalledWith("1");
  });
});
