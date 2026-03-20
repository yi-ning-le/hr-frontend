# AGENT.md

## Project

**hr-frontend** - HR management app (React 19, TypeScript, Vite, Bun, Tailwind v4, shadcn/ui, TanStack Router, Zustand, Vitest)

## Structure

```
src/
├── assets/              # Static assets
├── components/
│   ├── candidates/      # Candidate components
│   ├── home/           # Dashboard components
│   ├── interviews/     # Interview components
│   ├── layout/         # Header, Footer
│   └── ui/             # shadcn/ui primitives
├── hooks/              # Custom hooks
│   └── queries/        # TanStack Query hooks
├── lib/
│   ├── api/            # API client
│   ├── notifications/  # Notification utilities
│   ├── schemas/        # Zod schemas
│   └── utils.ts        # cn() helper
├── locales/            # i18n (en-US, zh-CN)
├── pages/              # Route pages
│   ├── admin/
│   ├── auth/
│   ├── employees/
│   ├── interviews/
│   ├── profile/
│   ├── recruitment/
│   └── settings/
├── routes/             # TanStack Router
│   └── __tests__/
├── stores/             # Zustand stores
│   └── __tests__/
├── test/               # Test setup & mocks
├── types/              # TypeScript types
├── App.tsx
├── main.tsx
└── router.ts
```

## Commands

| Command            | Description   |
| ------------------ | ------------- |
| `bun run dev`      | Dev server    |
| `bun run build`    | Build         |
| `bun run check`    | Lint + format |
| `bun run test:run` | Tests         |

## Conventions

- Imports: `@/` for `src/`
- Components: functional + TypeScript interfaces
- Styling: Tailwind + `cn()` utility
- Forms: `react-hook-form` + `zod`
- Tests: `__tests__/[filename].test.tsx`

## Skills (Required)

1. **TDD** (`tdd-first-codegen`): Write tests FIRST, then implement
2. **Performance** (`vercel-react-best-practices`): Avoid waterfalls, optimize bundles
3. **Design** (`web-design-guidelines`): WCAG compliance

## Workflow

1. Discover: read existing patterns
2. Plan: propose with TDD phases
3. Execute: tests → implementation
4. Verify: `bun run check` + `bun run test:run` + `bun run build`
