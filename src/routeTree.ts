import { Route as RootRoute } from "./routes/__root";

// Auth routes (public)
import { Route as AuthLayoutRoute } from "./routes/_auth";
import { Route as LoginRoute } from "./routes/_auth/login";
import { Route as RegisterRoute } from "./routes/_auth/register";

// Protected routes
import { Route as ProtectedLayoutRoute } from "./routes/_protected";
import { Route as EmployeesRoute } from "./routes/_protected/employees";
import { Route as EmployeeProfileRoute } from "./routes/_protected/employees.$employeeId";
import { Route as IndexRoute } from "./routes/_protected/index";
import { Route as InterviewDetailRoute } from "./routes/_protected/interviews.$interviewId";
import { Route as MyInterviewsRoute } from "./routes/_protected/my-interviews";
import { Route as RecruitmentRoute } from "./routes/_protected/recruitment";
import { Route as SettingsRoute } from "./routes/_protected/settings";

// Auth route tree
const authRouteTree = AuthLayoutRoute.addChildren([LoginRoute, RegisterRoute]);

// Protected route tree
const protectedRouteTree = ProtectedLayoutRoute.addChildren([
  IndexRoute,
  RecruitmentRoute,
  EmployeesRoute,
  EmployeeProfileRoute,
  SettingsRoute,
  MyInterviewsRoute,
  InterviewDetailRoute,
]);

// Main route tree
const routeTree = RootRoute.addChildren([authRouteTree, protectedRouteTree]);

export { routeTree };
