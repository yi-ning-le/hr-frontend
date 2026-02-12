import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { Footer } from "@/components/layout/Footer";
import { AdminPage } from "@/pages/admin/AdminPage";
import { AdminTabId } from "@/pages/admin/constants";
import { Route as ProtectedRoute } from "../_protected";

const adminSearchSchema = z.object({
  tab: z.nativeEnum(AdminTabId).optional().catch(AdminTabId.Recruiters),
});

export const Route = createRoute({
  getParentRoute: () => ProtectedRoute,
  path: "/admin",
  validateSearch: (search) => adminSearchSchema.parse(search),
  component: AdminRouteComponent,
});

function AdminRouteComponent() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <AdminHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <AdminPage
          activeTab={tab}
          onTabChange={(newTab) =>
            navigate({
              search: (prev) => ({ ...prev, tab: newTab }),
              replace: true,
            })
          }
        />
      </main>
      <Footer />
    </div>
  );
}
