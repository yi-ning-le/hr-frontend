// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Notification } from "@/types/notification";
import { NotificationItem } from "../NotificationItem";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
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
    search?: Record<string, string | undefined>;
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

const mockNotification: Notification = {
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

const mockNotificationWithLink: Notification = {
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
};

describe("NotificationItem", () => {
  it("renders notification title and message", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();
    const onDelete = vi.fn();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("New Resume Review Assigned")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You have been assigned to review a candidate's resume.",
      ),
    ).toBeInTheDocument();
  });

  it("renders time ago format", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();
    const onDelete = vi.fn();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
  });

  it("calls onRead when unread notification is clicked", async () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "New Resume Review Assigned" }),
    );

    expect(onRead).toHaveBeenCalledWith("1");
  });

  it("does not call onRead when already read notification is clicked", async () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <NotificationItem
        notification={mockNotificationWithLink}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "New Interview Assigned" }),
    );

    expect(onRead).not.toHaveBeenCalled();
  });

  it("renders route link when action is available", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();
    const onDelete = vi.fn();

    render(
      <NotificationItem
        notification={mockNotificationWithLink}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
      />,
    );

    const link = screen.getByTestId("router-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "/interviews/12345678-1234-1234-1234-123456789012",
    );
  });

  it("renders pending resumes deep link for reviewer assignment", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();
    const onDelete = vi.fn();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
      />,
    );

    const link = screen.getByTestId("router-link");
    expect(link).toHaveAttribute(
      "href",
      "/pending-resumes?tab=pending&reviewCandidateId=11111111-1111-1111-1111-111111111111",
    );
  });

  it("renders with correct accessibility label", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();
    const onDelete = vi.fn();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
      />,
    );

    expect(
      screen.getByRole("button", { name: "New Resume Review Assigned" }),
    ).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", async () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
      />,
    );

    const deleteButton = screen.getByRole("button", {
      name: /delete notification/i,
    });
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith("1");
    expect(onRead).not.toHaveBeenCalled();
  });
});
