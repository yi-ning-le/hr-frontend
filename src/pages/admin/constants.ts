export const AdminTabId = {
  Recruiters: "recruiters",
  HRManagement: "hr-management",
} as const;

export type AdminTabIdType = (typeof AdminTabId)[keyof typeof AdminTabId];
