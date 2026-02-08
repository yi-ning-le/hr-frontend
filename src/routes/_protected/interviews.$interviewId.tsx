import { createRoute } from "@tanstack/react-router";
import { Route as ProtectedLayoutRoute } from "../_protected";
import { InterviewDetailPage } from "@/pages/interviews/InterviewDetailPage";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/interviews/$interviewId",
  component: InterviewDetailPage,
});
