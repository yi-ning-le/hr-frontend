import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
})
