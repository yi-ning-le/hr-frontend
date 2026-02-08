import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { Route as RootRoute } from "./__root";

// Before load guard - checks authentication
function beforeLoadGuard() {
  const { isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated) {
    throw redirect({
      to: "/login",
    });
  }
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  id: "_protected",
  beforeLoad: beforeLoadGuard,
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
