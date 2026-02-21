// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotificationsAPI } from "@/lib/api";
import { NotificationBell } from "../NotificationBell";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

// Mock the router Link
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

// Mock the API calls
vi.mock("@/lib/api", () => ({
  NotificationsAPI: {
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  },
}));

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as typeof globalThis.ResizeObserver;

// Mock PointerEvent features needed for Radix UI
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("NotificationBell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockNotifications = [
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
      title: "Maintenance",
      message: "Server maintenance at midnight.",
      type: "SYSTEM",
      linkUrl: "/settings",
      isRead: true,
      createdAt: new Date().toISOString(),
    },
  ];

  it("renders the bell icon with the unread count", async () => {
    vi.mocked(NotificationsAPI.getUnreadCount).mockResolvedValue(5);
    vi.mocked(NotificationsAPI.getNotifications).mockResolvedValue(
      mockNotifications,
    );

    render(<NotificationBell />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    // The button that triggers the bell should be present
    const bellButton = screen.getByRole("button", { name: /notifications/i });
    expect(bellButton).toBeInTheDocument();
  });

  it("opens the popover and displays notifications", async () => {
    vi.mocked(NotificationsAPI.getUnreadCount).mockResolvedValue(1);
    vi.mocked(NotificationsAPI.getNotifications).mockResolvedValue(
      mockNotifications,
    );

    const user = userEvent.setup();
    render(<NotificationBell />, { wrapper: createWrapper() });

    const bellButton = await screen.findByRole("button", {
      name: /notifications/i,
    });
    await user.click(bellButton);

    await waitFor(() => {
      expect(screen.getByText("New Job Application")).toBeInTheDocument();
      expect(screen.getByText("John Doe applied for SWE.")).toBeInTheDocument();
      expect(screen.getByText("Maintenance")).toBeInTheDocument();
    });
  });

  it("calls markAsRead when a notification is clicked", async () => {
    vi.mocked(NotificationsAPI.getUnreadCount).mockResolvedValue(1);
    vi.mocked(NotificationsAPI.getNotifications).mockResolvedValue(
      mockNotifications,
    );
    vi.mocked(NotificationsAPI.markAsRead).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<NotificationBell />, { wrapper: createWrapper() });

    const bellButton = await screen.findByRole("button", {
      name: /notifications/i,
    });
    await user.click(bellButton);

    const unreadNotificationButton = await screen.findByRole("button", {
      name: "New Job Application",
    });
    await user.click(unreadNotificationButton);

    await waitFor(() => {
      expect(NotificationsAPI.markAsRead).toHaveBeenCalledWith("1");
    });
  });

  it("calls markAllAsRead when 'Mark all as read' is clicked", async () => {
    vi.mocked(NotificationsAPI.getUnreadCount).mockResolvedValue(1);
    vi.mocked(NotificationsAPI.getNotifications).mockResolvedValue(
      mockNotifications,
    );
    vi.mocked(NotificationsAPI.markAllAsRead).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<NotificationBell />, { wrapper: createWrapper() });

    const bellButton = await screen.findByRole("button", {
      name: /notifications/i,
    });
    await user.click(bellButton);

    const markAllButton = await screen.findByRole("button", {
      name: /mark all as read/i,
    });
    await user.click(markAllButton);

    await waitFor(() => {
      expect(NotificationsAPI.markAllAsRead).toHaveBeenCalled();
    });
  });

  it("displays empty state when there are no notifications", async () => {
    vi.mocked(NotificationsAPI.getUnreadCount).mockResolvedValue(0);
    vi.mocked(NotificationsAPI.getNotifications).mockResolvedValue([]);

    const user = userEvent.setup();
    render(<NotificationBell />, { wrapper: createWrapper() });

    const bellButton = await screen.findByRole("button", {
      name: /notifications/i,
    });
    await user.click(bellButton);

    await waitFor(() => {
      expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
    });
  });
});
