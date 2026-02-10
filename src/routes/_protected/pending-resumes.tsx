import { createRoute } from "@tanstack/react-router";
import PendingResumesPage from "@/pages/interviews/PendingResumesPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/pending-resumes",
  component: PendingResumesPage,
});
