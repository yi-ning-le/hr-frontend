import { createRoute } from "@tanstack/react-router";
import { Route as ProtectedLayoutRoute } from "../_protected";
import { MyInterviewsPage } from "@/pages/interviews/MyInterviewsPage";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/my-interviews",
  component: MyInterviewsPage,
});
