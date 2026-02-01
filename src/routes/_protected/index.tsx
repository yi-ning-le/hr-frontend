import { createRoute } from '@tanstack/react-router'
import { Route as ProtectedLayoutRoute } from '../_protected'
import { Home } from "@/components/home/Home";

export const Route = createRoute({
  getParentRoute: () => ProtectedLayoutRoute,
  path: '/',
  component: Home,
})
