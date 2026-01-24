import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'
import { RecruitmentPage } from '@/pages/recruitment/RecruitmentPage'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/recruitment',
  component: RecruitmentPage,
})
