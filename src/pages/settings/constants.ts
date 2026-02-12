export const SettingsTabId = {
  CandidateStatuses: "candidate-statuses",
  General: "general",
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
] as const;
