export interface NotificationSubject {
  type: string;
  id: string;
}

export interface NotificationContent {
  titleKey: string;
  messageKey: string;
  params?: Record<string, unknown>;
}

export interface NotificationAction {
  kind: string;
  params?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  userId: string;
  eventType: string;
  subject: NotificationSubject;
  context?: Record<string, unknown>;
  content: NotificationContent;
  action?: NotificationAction | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationUnreadCount {
  count: number;
}
