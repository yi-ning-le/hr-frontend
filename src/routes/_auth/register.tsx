import { createRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/pages/auth/register";
import { Route as AuthLayoutRoute } from "../_auth";

export const Route = createRoute({
  getParentRoute: () => AuthLayoutRoute,
  path: "/register",
  component: RegisterPage,
});
