import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { RecruitmentPage } from "@/pages/recruitment/RecruitmentPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

const recruitmentSearchSchema = z.object({
  tab: z
    .enum(["overview", "jobs", "candidates", "calendar"])
    .optional()
    .catch("overview"),
});

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/recruitment",
  validateSearch: (search) => recruitmentSearchSchema.parse(search),
  component: RecruitmentPage,
});
