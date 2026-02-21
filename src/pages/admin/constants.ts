export const AdminTabId = {
  Recruiters: "recruiters",
  Interviewers: "interviewers",
  HRManagement: "hr-management",
} as const;

export type AdminTabIdType = (typeof AdminTabId)[keyof typeof AdminTabId];
