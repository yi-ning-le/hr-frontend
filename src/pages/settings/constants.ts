export const SettingsTabId = {
  CandidateStatuses: "candidate-statuses",
  General: "general",
  Recruiters: "recruiters",
  HRManagement: "hr-management",
} as const;

export type SettingsTabIdType =
  (typeof SettingsTabId)[keyof typeof SettingsTabId];

export const SETTINGS_TABS = [
  {
    id: SettingsTabId.CandidateStatuses,
    labelKey: "settings.tabs.candidateStatuses",
    defaultLabel: "Candidate Statuses",
  },
  {
    id: SettingsTabId.General,
    labelKey: "settings.tabs.general",
    defaultLabel: "General",
  },
  {
    id: SettingsTabId.Recruiters,
    labelKey: "settings.tabs.recruiters",
    defaultLabel: "Recruiters",
    adminOnly: true,
  },
  {
    id: SettingsTabId.HRManagement,
    labelKey: "settings.tabs.hrManagement",
    defaultLabel: "HR Management",
    adminOnly: true,
  },
] as const;
