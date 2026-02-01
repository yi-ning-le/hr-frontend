import { createRoute } from "@tanstack/react-router";
import { Route as AuthLayoutRoute } from "../_auth";
import { RegisterPage } from "@/pages/auth/register";

export const Route = createRoute({
  getParentRoute: () => AuthLayoutRoute,
  path: "/register",
  component: RegisterPage,
});
