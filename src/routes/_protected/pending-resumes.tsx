import { createRoute } from "@tanstack/react-router";
import PendingResumesPage from "@/pages/interviews/PendingResumesPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

import { redirect } from "@tanstack/react-router";
import { queryClient } from "@/lib/queryClient";
import { userRoleQueryOptions } from "@/hooks/useUserRole";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/pending-resumes",
  beforeLoad: async () => {
    // Ensure roles are loaded (though _protected should have handled it)
    const roles = await queryClient.ensureQueryData(userRoleQueryOptions);

    if (!roles.isInterviewer) {
      // Redirect to home or show error
      // Ideally redirect to 403 page or home
      throw redirect({
        to: "/",
      });
    }
  },
  component: PendingResumesPage,
});
