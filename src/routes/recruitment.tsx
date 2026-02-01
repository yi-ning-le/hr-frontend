import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'
import { RecruitmentPage } from '@/pages/recruitment/RecruitmentPage'
import { z } from 'zod'

const recruitmentSearchSchema = z.object({
  tab: z.enum(['overview', 'jobs', 'candidates', 'calendar']).optional().catch('overview'),
})

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/recruitment',
  validateSearch: (search) => recruitmentSearchSchema.parse(search),
  component: RecruitmentPage,
})
