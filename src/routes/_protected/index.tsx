import { createRoute } from "@tanstack/react-router";
import { Home } from "@/components/home/Home";
import { Route as ProtectedLayoutRoute } from "../_protected";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: "/",
  component: Home,
});
