import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
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
});

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/recruitment",
  validateSearch: (search) => recruitmentSearchSchema.parse(search),
  component: RecruitmentPage,
});
