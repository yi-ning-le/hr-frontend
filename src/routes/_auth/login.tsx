import { createRoute } from "@tanstack/react-router";
import { LoginPage } from "@/pages/auth/login";
import { Route as AuthLayoutRoute } from "../_auth";

export const Route = createRoute({
  getParentRoute: () => AuthLayoutRoute,
  path: "/login",
  component: LoginPage,
});
