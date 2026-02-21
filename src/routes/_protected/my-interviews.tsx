import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { userRoleQueryOptions } from "@/hooks/useUserRole";
import { queryClient } from "@/lib/queryClient";
import { MyInterviewsPage } from "@/pages/interviews/MyInterviewsPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

const myInterviewsSearchSchema = z.object({
  viewMode: z.enum(["list", "calendar"]).optional().default("list"),
});

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/my-interviews",
  validateSearch: (search) => myInterviewsSearchSchema.parse(search),
  beforeLoad: async () => {
    const roles = await queryClient.ensureQueryData(userRoleQueryOptions());
    const canAccessInterviews =
      roles.isInterviewer || roles.isRecruiter || roles.isAdmin;

    if (!canAccessInterviews) {
      throw redirect({ to: "/" });
    }
  },
  component: MyInterviewsPage,
});
