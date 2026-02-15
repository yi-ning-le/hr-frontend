import { createRoute } from "@tanstack/react-router";
import { MyProfilePage } from "@/pages/profile/MyProfilePage";
import { Route as ProtectedRoute } from "../_protected";

export const Route = createRoute({
  getParentRoute: () => ProtectedRoute,
  path: "/profile",
  component: MyProfilePage,
});
