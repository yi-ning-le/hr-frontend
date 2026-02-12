import {
  createRoute,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { userRoleQueryOptions } from "@/hooks/useUserRole";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/useAuthStore";
import { Route as RootRoute } from "./__root";

const isAdminPath = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/");

// Before load guard - checks authentication
export async function beforeLoadGuard({
  location,
}: {
  location: { pathname: string };
}) {
  const { isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated) {
    throw redirect({
      to: "/login",
    });
  }

  // Ensure role data matches the requirements
  try {
    const roleData = await queryClient.ensureQueryData(userRoleQueryOptions());
    const isAdmin = roleData.isAdmin;

    if (isAdmin) {
      if (!isAdminPath(location.pathname)) {
        throw redirect({
          to: "/admin",
        });
      }
    } else {
      if (isAdminPath(location.pathname)) {
        throw redirect({
          to: "/",
        });
      }
    }
  } catch (error) {
    if (error instanceof Response) throw error; // Re-throw redirects
    console.error("Failed to fetch user roles in guard:", error);
    // Fail closed: we can't trust route authorization if role fetch fails.
    throw redirect({
      to: "/login",
      replace: true,
    });
  }
}

function ProtectedLayout() {
  const router = useRouter();
  const location = router.state.location;

  if (isAdminPath(location.pathname)) {
    return <Outlet />;
  }

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
