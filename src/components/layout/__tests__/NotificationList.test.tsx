// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Notification } from "@/types/notification";
import { NotificationList } from "../NotificationList";

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

// Mock ResizeObserver for ScrollArea component
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as typeof globalThis.ResizeObserver;

const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "u1",
    title: "New Job Application",
    message: "John Doe applied for SWE.",
    type: "SYSTEM",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "u1",
    title: "Interview Scheduled",
    message: "Your interview is tomorrow.",
    type: "SYSTEM",
    linkUrl: "/interviews/123",
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
      />,
    );

    expect(screen.getByText("New Job Application")).toBeInTheDocument();
    expect(screen.getByText("Interview Scheduled")).toBeInTheDocument();
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
      />,
    );

    expect(screen.getByText("John Doe applied for SWE.")).toBeInTheDocument();
    expect(screen.getByText("Your interview is tomorrow.")).toBeInTheDocument();
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
      />,
    );

    expect(screen.queryByText(/no notifications/i)).not.toBeInTheDocument();
  });

  it("passes correct props to NotificationItem", async () => {
    const onRead = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <NotificationList
        notifications={mockNotifications}
        isLoading={false}
        onRead={onRead}
        onViewDetails={onViewDetails}
      />,
    );

    // Find the button inside NotificationItem and click it
    const unreadNotification = screen.getByRole("button", {
      name: "New Job Application",
    });
    unreadNotification.click();

    expect(onRead).toHaveBeenCalledWith("1");
  });
});
