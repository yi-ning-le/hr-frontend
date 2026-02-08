import { createRoute } from "@tanstack/react-router";
import { InterviewDetailPage } from "@/pages/interviews/InterviewDetailPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/interviews/$interviewId",
  component: InterviewDetailPage,
});
