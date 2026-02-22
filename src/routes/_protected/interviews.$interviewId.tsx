import { createRoute, redirect } from "@tanstack/react-router";
import { userRoleQueryOptions } from "@/hooks/useUserRole";
import { queryClient } from "@/lib/queryClient";
import { InterviewDetailPage } from "@/pages/interviews/InterviewDetailPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/interviews/$interviewId",
  beforeLoad: async () => {
    const roles = await queryClient.ensureQueryData(userRoleQueryOptions());
    const canAccessInterviews =
      roles.isInterviewer || roles.isRecruiter || roles.isAdmin;

    if (!canAccessInterviews) {
      throw redirect({ to: "/" });
    }
  },
  component: InterviewDetailPage,
});
