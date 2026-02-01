import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { AuthLayout } from "@/components/layout/AuthLayout";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  id: "_auth",
  component: () => <AuthLayout />,
});
