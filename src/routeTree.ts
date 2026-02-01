import { Route as RootRoute } from "./routes/__root";

// Auth routes (public)
import { Route as AuthLayoutRoute } from "./routes/_auth";
import { Route as LoginRoute } from "./routes/_auth/login";
import { Route as RegisterRoute } from "./routes/_auth/register";

// Protected routes
import { Route as ProtectedLayoutRoute } from "./routes/_protected";
import { Route as IndexRoute } from "./routes/_protected/index";
import { Route as RecruitmentRoute } from "./routes/_protected/recruitment";

// Auth route tree
const authRouteTree = AuthLayoutRoute.addChildren([LoginRoute, RegisterRoute]);

// Protected route tree
const protectedRouteTree = ProtectedLayoutRoute.addChildren([
  IndexRoute,
  RecruitmentRoute,
]);

// Main route tree
const routeTree = RootRoute.addChildren([authRouteTree, protectedRouteTree]);

export { routeTree };
