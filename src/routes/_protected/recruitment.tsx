import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { userRoleQueryOptions } from "@/hooks/useUserRole";
import { queryClient } from "@/lib/queryClient";
import { RecruitmentPage } from "@/pages/recruitment/RecruitmentPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

const recruitmentSearchSchema = z.object({
  tab: z
    .enum(["overview", "jobs", "candidates", "calendar"])
    .optional()
    .catch("overview"),
  jobId: z.string().optional().catch("all"),
  q: z.string().optional().catch(""),
  candidateId: z.string().optional(),
  view: z.enum(["list", "board"]).optional().catch("board"),
  status: z.array(z.string()).optional().catch([]),
  page: z.number().optional().catch(1),
  limit: z.number().optional().catch(50),
});

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/recruitment",
  validateSearch: (search) => recruitmentSearchSchema.parse(search),
  beforeLoad: async () => {
    const roles = await queryClient.ensureQueryData(userRoleQueryOptions());
    if (!roles.isAdmin && !roles.isRecruiter) {
      throw redirect({ to: "/" });
    }
  },
  component: RecruitmentPage,
});
