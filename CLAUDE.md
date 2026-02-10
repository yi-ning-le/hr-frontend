# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**hr-frontend** is a modern human resources management frontend web application.

- **Framework:** React 19 + TypeScript (~5.9) + Vite (Rolldown)
- **Runtime:** Bun
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix UI)
- **State Management:** Zustand
- **Routing:** TanStack Router
- **Forms:** react-hook-form + zod
- **Testing:** Vitest + React Testing Library

## Development Commands

- **Start Dev Server:** `bun run dev`
- **Build:** `bun run build`
- **Lint:** `bun run lint` (Biome)
- **Format:** `bun run format` (Biome)
- **Check & Fix:** `bun run check` (Biome)
- **Run Tests:** `bun run test` (Watch mode)
- **Run Tests Once:** `bun run test:run`
- **Run Single Test:** `bun run test:run [filename]`
- **Test Coverage:** `bun run test:coverage`

## Code Structure

```text
src/
├── components/      # React components
│   ├── home/        # Dashboard/Home page components
│   ├── layout/      # Layout components (Header, Footer)
│   └── ui/          # Reusable shadcn/ui primitives
├── hooks/           # Custom React hooks
├── lib/             # Utilities (cn helper in utils.ts)
├── pages/           # Feature-based page components
├── routes/          # TanStack Router route definitions
├── stores/          # Zustand state stores
├── types/           # TypeScript type definitions
├── App.tsx          # Main application component
├── main.tsx         # Entry point
├── router.ts        # TanStack Router instance
└── routeTree.ts     # Generated route tree
```

## Guidelines & Conventions

### General
- **Path Aliases:** Use `@/` to import from `src`.
- **Styling:** Use Tailwind utility classes. Use `cn()` from `@/lib/utils` for conditional classes.
- **Routing:** Define routes in `src/routes/`. Use TanStack Router.
- **State:** Use Zustand for global state.
- **Components:** Functional components with TypeScript interfaces. Reusable primitives in `src/components/ui`.
- **Forms:** Use `react-hook-form` with `zodResolver`.
- **Testing:** Tests in `__tests__` adjacent to files. Naming: `[filename].test.tsx`.

### Agent Skills & Best Practices
This project has specific agent skills configured in `.agents/skills`:

1.  **TDD First (`tdd-first-codegen`):** Strictly follow Test-Driven Development. Write tests *before* implementation.
    -   **Phase 1:** Define testable behavior.
    -   **Phase 2:** Write failing tests (RED).
    -   **Phase 3:** Plan implementation.
    -   **Phase 4:** Implement (GREEN) only after approval.
    -   **Phase 5:** Refactor.

2.  **Vercel React Best Practices (`vercel-react-best-practices`):**
    -   Prioritize eliminating waterfalls (`async-*`).
    -   Optimize bundle size (avoid barrel files, use dynamic imports).
    -   Use `React.cache()` and `Suspense` effectively.

3.  **Web Design Guidelines (`web-design-guidelines`):**
    -   Ensure UI compliance.
    -   Check accessibility.
