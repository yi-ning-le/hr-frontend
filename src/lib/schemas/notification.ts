import { z } from "zod";

const notificationSubjectSchema = z.object({
  type: z.string().min(1),
  id: z.string().uuid(),
});

const notificationContentSchema = z.object({
  titleKey: z.string().min(1),
  messageKey: z.string().min(1),
  params: z.record(z.string(), z.unknown()).optional(),
});

const notificationActionSchema = z.object({
  kind: z.string().min(1),
  params: z.record(z.string(), z.unknown()).optional(),
});

export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  eventType: z.string().min(1),
  subject: notificationSubjectSchema,
  context: z.record(z.string(), z.unknown()).optional(),
  content: notificationContentSchema,
  action: notificationActionSchema.nullish(),
  isRead: z.boolean(),
  createdAt: z.string(),
});

export const notificationsSchema = z.array(notificationSchema);

export const notificationUnreadCountSchema = z.object({
  count: z.number().int().nonnegative(),
});
