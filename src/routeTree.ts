import { Route as RootRoute } from "./routes/__root";
import { Route as IndexRoute } from "./routes/index";
import { Route as RecruitmentRoute } from "./routes/recruitment";

const routeTree = RootRoute.addChildren([IndexRoute, RecruitmentRoute]);

export { routeTree };
