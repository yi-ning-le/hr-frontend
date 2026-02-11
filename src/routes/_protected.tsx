import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/stores/useAuthStore";
import { Route as RootRoute } from "./__root";

import { queryClient } from "@/lib/queryClient";
import { userRoleQueryOptions } from "@/hooks/useUserRole";

// Before load guard - checks authentication
export async function beforeLoadGuard() {
  const { isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated) {
    throw redirect({
      to: "/login",
    });
  }

  // Ensure role data matches the requirements
  try {
    await queryClient.ensureQueryData(userRoleQueryOptions);
  } catch (error) {
    console.error("Failed to fetch user roles in guard:", error);
    // Optionally redirect or allow partial access, but for now we just log
  }
}

function ProtectedLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  id: "_protected",
  beforeLoad: beforeLoadGuard,
  component: ProtectedLayout,
});
