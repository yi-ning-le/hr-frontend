import { createRoute } from "@tanstack/react-router";
import { Route as AuthLayoutRoute } from "../_auth";
import { LoginPage } from "@/pages/auth/login";

export const Route = createRoute({
  getParentRoute: () => AuthLayoutRoute,
  path: "/login",
  component: LoginPage,
});
