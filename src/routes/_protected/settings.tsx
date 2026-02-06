import { createRoute } from "@tanstack/react-router";
import { Route as ProtectedRoute } from "../_protected";
import { SettingsPage } from "@/pages/settings/SettingsPage";

export const Route = createRoute({
  getParentRoute: () => ProtectedRoute,
  path: "/settings",
  component: SettingsPage,
});
