import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { userRoleQueryOptions } from "@/hooks/useUserRole";
import { queryClient } from "@/lib/queryClient";
import { AdminTabId } from "@/pages/admin/constants";
import {
  SETTINGS_TABS,
  SettingsTabId,
  type SettingsTabIdType,
} from "@/pages/settings/constants";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { Route as ProtectedRoute } from "../_protected";

const validSettingsSearchTabs = [
  ...Object.values(SettingsTabId),
  ...Object.values(AdminTabId),
] as const;

const settingsSearchSchema = z.object({
  tab: z
    .enum(validSettingsSearchTabs as unknown as [string, ...string[]])
    .catch(SettingsTabId.CandidateStatuses)
    .optional(),
});

export const Route = createRoute({
  getParentRoute: () => ProtectedRoute,
  path: "/settings",
  validateSearch: (search) => settingsSearchSchema.parse(search ?? {}),
  beforeLoad: async ({ search }) => {
    const tab = search.tab || SettingsTabId.CandidateStatuses;
    const isAdminTab = (Object.values(AdminTabId) as string[]).includes(tab);

    if (isAdminTab) {
      throw redirect({
        to: "/admin",
        replace: true,
      });
    }

    const targetTab = SETTINGS_TABS.find((t) => t.id === tab);
    if (targetTab?.isVisible) {
      const roleData = await queryClient.ensureQueryData(
        userRoleQueryOptions(),
      );
      const context = {
        isAdmin: roleData?.isAdmin ?? false,
        isRecruiter: roleData?.isRecruiter ?? false,
        isInterviewer: roleData?.isInterviewer ?? false,
        isHR: roleData?.isHR ?? false,
      };

      if (!targetTab.isVisible(context)) {
        throw redirect({
          to: "/settings",
          search: { tab: SettingsTabId.General },
          replace: true,
        });
      }
    }
  },
  component: SettingsRouteComponent,
});

function SettingsRouteComponent() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  const isSettingsTab = (t: string): t is SettingsTabIdType =>
    Object.values(SettingsTabId).includes(t as SettingsTabIdType);

  const currentTab = tab || SettingsTabId.CandidateStatuses;
  const normalizedTab: SettingsTabIdType | undefined = isSettingsTab(currentTab)
    ? currentTab
    : undefined;

  return (
    <SettingsPage
      activeTab={normalizedTab}
      onTabChange={(newTab) =>
        navigate({
          search: (prev) => ({ ...prev, tab: newTab }),
          replace: true,
        })
      }
    />
  );
}
