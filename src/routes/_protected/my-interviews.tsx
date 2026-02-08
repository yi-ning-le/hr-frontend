import { createRoute } from "@tanstack/react-router";
import { MyInterviewsPage } from "@/pages/interviews/MyInterviewsPage";
import { Route as ProtectedLayoutRoute } from "../_protected";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/my-interviews",
  component: MyInterviewsPage,
});
