import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { Route as ProtectedRoute } from "../_protected";

const settingsSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createRoute({
  getParentRoute: () => ProtectedRoute,
  path: "/settings",
  validateSearch: (search) => settingsSearchSchema.parse(search),
  component: SettingsRouteComponent,
});

function SettingsRouteComponent() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <SettingsPage
      activeTab={tab}
      onTabChange={(newTab) =>
        navigate({
          search: (prev) => ({ ...prev, tab: newTab }),
          replace: true,
        })
      }
    />
  );
}
