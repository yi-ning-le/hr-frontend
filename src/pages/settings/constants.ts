export const SettingsTabId = {
  CandidateStatuses: "candidate-statuses",
  General: "general",
} as const;

export type SettingsTabIdType =
  (typeof SettingsTabId)[keyof typeof SettingsTabId];

export interface UserRoleContext {
  isAdmin: boolean;
  isRecruiter: boolean;
  isInterviewer: boolean;
  isHR: boolean;
  canReviewResumes: boolean;
}

export interface SettingsTab {
  id: SettingsTabIdType;
  labelKey: string;
  defaultLabel: string;
  isVisible?: (role: UserRoleContext) => boolean;
}

export const SETTINGS_TABS: SettingsTab[] = [
  {
    id: SettingsTabId.CandidateStatuses,
    labelKey: "settings.tabs.candidateStatuses",
    defaultLabel: "Candidate Statuses",
    isVisible: (role) => role.isRecruiter,
  },
  {
    id: SettingsTabId.General,
    labelKey: "settings.tabs.general",
    defaultLabel: "General",
  },
];
