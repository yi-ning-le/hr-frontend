import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { AdminTabId } from "@/pages/admin/constants";
import {
  SettingsTabId,
  type SettingsTabIdType,
} from "@/pages/settings/constants";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { Route as ProtectedRoute } from "../_protected";

const validSettingsSearchTabs = [
  SettingsTabId.CandidateStatuses,
  SettingsTabId.General,
  AdminTabId.Recruiters,
  AdminTabId.HRManagement,
] as const;

const settingsSearchSchema = z.object({
  tab: z
    .enum(validSettingsSearchTabs)
    .optional()
    .catch(SettingsTabId.CandidateStatuses),
});

export const Route = createRoute({
  getParentRoute: () => ProtectedRoute,
  path: "/settings",
  validateSearch: (search) => settingsSearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    if (
      search.tab === AdminTabId.Recruiters ||
      search.tab === AdminTabId.HRManagement
    ) {
      throw redirect({
        to: "/admin",
        replace: true,
      });
    }
  },
  component: SettingsRouteComponent,
});

function SettingsRouteComponent() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const normalizedTab: SettingsTabIdType | undefined =
    tab === SettingsTabId.CandidateStatuses || tab === SettingsTabId.General
      ? tab
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
