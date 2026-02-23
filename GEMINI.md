# Project Context: hr-frontend

## Project Overview

**hr-frontend** is a modern human resources management frontend web application built with **React 19**, **TypeScript**, and **Vite** (specifically using the experimental **Rolldown** bundler via `rolldown-vite`).

The project utilizes **Tailwind CSS v4** for styling and adopts the **shadcn/ui** component architecture (built on Radix UI primitives) for a consistent and accessible design system. Routing is handled by **TanStack Router**, and state management is powered by **Zustand**.

## Tech Stack

### Core

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (~5.9)
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Bundler:** [Vite](https://vitejs.dev/) (using `@vitejs/plugin-react-swc` and `rolldown-vite` override)
- **Runtime/Package Manager:** [Bun](https://bun.sh/) (inferred from `bun.lock`)

### UI & Styling

- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Library:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theming:** `next-themes`
- **Charts:** `recharts`
- **Toasts:** `sonner`
- **Drag & Drop:** `@hello-pangea/dnd`

### Data & Logic

- **Forms:** `react-hook-form`
- **Validation:** `zod` + `@hookform/resolvers`
- **Dates:** `date-fns`

### Testing

- **Framework:** [Vitest](https://vitest.dev/)
- **Library:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Environment:** `jsdom`

## Project Structure

```text
/
├── components.json      # shadcn/ui configuration
├── vite.config.ts       # Vite configuration (aliases, plugins, rolldown)
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project dependencies and scripts
├── src/
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── components/      # React components
│   │   ├── home/        # Dashboard/Home page components
│   │   ├── layout/      # Layout components (Header, Footer)
│   │   └── ui/          # Reusable shadcn/ui primitives
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities (utils.ts contains the `cn` helper)
│   ├── locales/         # i18n localization files (zh-CN, en-US)
│   ├── pages/           # Feature-based page components (e.g., recruitment)
│   ├── routes/          # TanStack Router route definitions
│   ├── stores/          # Zustand state stores
│   ├── test/            # Test setup, mocks, and utilities
│   ├── types/           # TypeScript type definitions
│   ├── App.css          # Application specific styles
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   ├── router.ts        # TanStack Router instance configuration
│   ├── routeTree.ts     # Generated route tree
│   └── index.css        # Global styles and Tailwind directives
└── public/              # Static assets
```

## Development Workflow

### Scripts

The project uses `bun` (or `npm`) scripts defined in `package.json`:

- **Start Development Server:** `bun run dev`
- **Build for Production:** `bun run build` (Runs `tsc` and then Vite build)
- **Lint Code:** `bun run lint` (Uses **Biome** for linting)
- **Format Code:** `bun run format` (Uses **Biome** for formatting)
- **Check & Fix:** `bun run check` (Uses **Biome** for linting, formatting, and import sorting)
- **Run Tests:** `bun run test` (Vitest watch mode)
- **Run Tests Once:** `bun run test:run`
- **Test Coverage:** `bun run test:coverage`

## Development Conventions

- **Path Aliases:** Use `@/` to import from the `src` directory (configured in `tsconfig.json` and `vite.config.ts`).
  - Example: `import { Button } from "@/components/ui/button"`
- **Styling:** Use Tailwind utility classes.
  - For conditional classes, use the `cn()` utility from `@/lib/utils`.
- **Routing:** Use TanStack Router for navigation and state-in-the-URL. Define routes in `src/routes/`.
- **State Management:** Use Zustand for global UI state or complex shared logic.
- **Components:**
  - Place reusable UI primitives in `src/components/ui`.
  - Prefer functional components with TypeScript interfaces for props.
  - Keep components small and focused.
- **Forms:**
  - Define validation schemas using `zod`.
  - Use `react-hook-form` with `zodResolver`.
- **Testing:**
  - Place tests in `__tests__` directories adjacent to the files they test.
  - Follow the naming convention `[filename].test.tsx`.

## Agent Skills & Guidelines

The project includes specific guidelines for AI agents to follow, located in `.agents/skills`.

### 1. Web Interface Guidelines

- **Purpose:** Ensure compliance with Web Interface Guidelines for UI/UX.
- **Location:** `.agents/skills/web-design-guidelines/SKILL.md`

### 2. Vercel React Best Practices

- **Purpose:** Performance optimization guidelines for React.
- **Location:** `.agents/skills/vercel-react-best-practices/SKILL.md`
- **Key Focus Areas:** Eliminating waterfalls, bundle optimization, and re-render optimization.
