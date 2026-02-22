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
    className,
  }: {
    children: React.ReactNode;
    to: string;
    className?: string;
  }) => (
    <a href={to} className={className} data-testid="router-link">
      {children}
    </a>
  ),
}));

vi.mock("date-fns", () => ({
  formatDistanceToNow: vi.fn(() => "5 minutes ago"),
}));

const mockNotification: Notification = {
  id: "1",
  userId: "u1",
  title: "New Job Application",
  message: "John Doe applied for Software Engineer position.",
  type: "SYSTEM",
  isRead: false,
  createdAt: new Date().toISOString(),
};

const mockNotificationWithLink: Notification = {
  id: "2",
  userId: "u1",
  title: "Interview Scheduled",
  message: "Your interview is scheduled for tomorrow.",
  type: "SYSTEM",
  linkUrl: "/interviews/123",
  isRead: true,
  createdAt: new Date().toISOString(),
};

describe("NotificationItem", () => {
  it("renders notification title and message", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
      />,
    );

    expect(screen.getByText("New Job Application")).toBeInTheDocument();
    expect(
      screen.getByText("John Doe applied for Software Engineer position."),
    ).toBeInTheDocument();
  });

  it("renders time ago format", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
      />,
    );

    expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
  });

  it("calls onRead when unread notification is clicked", async () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();
    const user = userEvent.setup();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "New Job Application" }),
    );

    expect(onRead).toHaveBeenCalledWith("1");
  });

  it("does not call onRead when already read notification is clicked", async () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();
    const user = userEvent.setup();

    render(
      <NotificationItem
        notification={mockNotificationWithLink}
        onRead={onRead}
        onViewDetails={onViewDetails}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Interview Scheduled" }),
    );

    expect(onRead).not.toHaveBeenCalled();
  });

  it("renders link when linkUrl is provided", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationItem
        notification={mockNotificationWithLink}
        onRead={onRead}
        onViewDetails={onViewDetails}
      />,
    );

    const link = screen.getByTestId("router-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/interviews/123");
  });

  it("does not render link when linkUrl is not provided", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
      />,
    );

    expect(screen.queryByTestId("router-link")).not.toBeInTheDocument();
  });

  it("renders with correct accessibility label", () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationItem
        notification={mockNotification}
        onRead={onRead}
        onViewDetails={onViewDetails}
      />,
    );

    expect(
      screen.getByRole("button", { name: "New Job Application" }),
    ).toBeInTheDocument();
  });
});
