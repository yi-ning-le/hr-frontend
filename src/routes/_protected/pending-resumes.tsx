import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { userRoleQueryOptions } from "@/hooks/useUserRole";
import { queryClient } from "@/lib/queryClient";
import PendingResumesPage from "@/pages/interviews/PendingResumesPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

const pendingResumesSearchSchema = z.object({
  reviewCandidateId: z.string().optional(),
});

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/pending-resumes",
  validateSearch: (search) => pendingResumesSearchSchema.parse(search),
  beforeLoad: async () => {
    const roles = await queryClient.ensureQueryData(userRoleQueryOptions());
    const canAccessInterviews = roles.isInterviewer || roles.isRecruiter;

    if (!canAccessInterviews) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: PendingResumesPage,
});
