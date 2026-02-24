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

vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: () => ({
    isAdmin: false,
    isRecruiter: true,
    isInterviewer: true,
    isHR: false,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

// Mock the router Link
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

// Mock the API calls
vi.mock("@/lib/api", () => ({
  NotificationsAPI: {
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    deleteNotification: vi.fn(),
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

  it("renders the bell icon with the unread count", async () => {
    vi.mocked(NotificationsAPI.getUnreadCount).mockResolvedValue(5);
    vi.mocked(NotificationsAPI.getNotifications).mockResolvedValue(
      mockNotifications,
    );

    render(<NotificationBell />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

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
      expect(
        screen.getByText("New Resume Review Assigned"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "You have been assigned to review a candidate's resume.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("New Interview Assigned")).toBeInTheDocument();
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
      name: "New Resume Review Assigned",
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
