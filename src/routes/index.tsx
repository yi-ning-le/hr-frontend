import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'
import { Home } from "@/components/home/Home";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: Home,
})
