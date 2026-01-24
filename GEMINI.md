# Project Context: hr-frontend

## Project Overview
**hr-frontend** is a modern frontend web application built with **React 19**, **TypeScript**, and **Vite** (specifically using the experimental **Rolldown** bundler via `rolldown-vite`).

The project utilizes **Tailwind CSS v4** for styling and adopts the **shadcn/ui** component architecture (built on Radix UI primitives) for a consistent and accessible design system.

## Tech Stack

### Core
*   **Framework:** [React 19](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) (~5.9)
*   **Bundler:** [Vite](https://vitejs.dev/) (using `@vitejs/plugin-react-swc` and `rolldown-vite` override)
*   **Runtime/Package Manager:** [Bun](https://bun.sh/) (inferred from `bun.lock`)

### UI & Styling
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Component Library:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Theming:** `next-themes`
*   **Charts:** `recharts`
*   **Toasts:** `sonner`

### Data & Logic
*   **Forms:** `react-hook-form`
*   **Validation:** `zod` + `@hookform/resolvers`
*   **Dates:** `date-fns`

## Project Structure

```text
/
├── components.json      # shadcn/ui configuration
├── vite.config.ts       # Vite configuration (aliases, plugins)
├── tsconfig.json        # TypeScript configuration
├── src/
│   ├── components/      # React components
│   │   └── ui/          # Reusable shadcn/ui primitives (Button, Input, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities (utils.ts typically contains the `cn` helper)
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles and Tailwind directives
└── public/              # Static assets
```

## Development Workflow

### Prerequisites
*   **Node.js** or **Bun** installed.

### Scripts
The project uses `bun` (or `npm`) scripts defined in `package.json`:

*   **Start Development Server:**
    ```bash
    bun run dev
    # or
    npm run dev
    ```
*   **Build for Production:**
    ```bash
    bun run build
    # or
    npm run build
    ```
    *Runs TypeScript compiler (`tsc`) and then Vite build.*

*   **Lint Code:**
    ```bash
    bun run lint
    # or
    npm run lint
    ```
    *Uses ESLint.*

## Development Conventions

*   **Path Aliases:** Use `@/` to import from the `src` directory (configured in `tsconfig.json` and `vite.config.ts`).
    *   Example: `import { Button } from "@/components/ui/button"`
*   **Styling:** Use Tailwind utility classes.
    *   For conditional classes, use the `cn()` utility (typically found in `@/lib/utils`): `className={cn("base-class", condition && "active-class")}`.
*   **Components:**
    *   Place reusable UI primitives in `src/components/ui`.
    *   Prefer functional components with TypeScript interfaces for props.
*   **Forms:**
    *   Define validation schemas using `zod`.
    *   Use `react-hook-form` `useForm` hook with `zodResolver`.

## Agent Skills & Guidelines

The project includes specific guidelines for AI agents to follow, located in `.agents/skills`.

### 1. Web Interface Guidelines
*   **Purpose:** Ensure compliance with Web Interface Guidelines for UI/UX.
*   **Location:** `.agents/skills/web-design-guidelines/SKILL.md`
*   **Usage:** When reviewing UI, checking accessibility, or auditing design, fetch the latest guidelines from the source URL provided in the skill file.

### 2. Vercel React Best Practices
*   **Purpose:** Performance optimization guidelines for React and Next.js.
*   **Location:** `.agents/skills/vercel-react-best-practices/SKILL.md`
*   **Key Focus Areas:**
    *   Eliminating Waterfalls (Critical)
    *   Bundle Size Optimization (Critical)
    *   Server-Side Performance
    *   Client-Side Data Fetching
    *   Re-render Optimization