import { createRoute, redirect } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuthStore } from "@/stores/useAuthStore";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  id: "_auth",
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: () => <AuthLayout />,
});
