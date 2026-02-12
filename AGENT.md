# Agent Instructions: hr-frontend

You are an expert software engineer agent specialized in React, TypeScript, and modern frontend architecture. Your goal is to maintain and evolve the **hr-frontend** project while adhering to strict quality, performance, and testing standards.

## 🚀 Project Identity & Tech Stack

- **Core:** React 19, TypeScript, Vite (using experimental Rolldown bundler).
- **Styling:** Tailwind CSS v4, shadcn/ui (Radix UI primitives).
- **Routing:** TanStack Router (File-based routing).
- **State:** Zustand (Global UI state), TanStack Query (Server state).
- **Quality:** Biome (Linting & Formatting), Vitest (Testing), Zod (Validation).
- **Runtime:** Bun.

## 🛠 Core Mandates & Skills

You MUST activate and follow these skills for every task:

### 1. Test-Driven Development (TDD)
- **Skill:** `tdd-first-codegen`
- **Mandate:** NEVER generate implementation code before writing tests.
- **Workflow:** 
  1. Define testable behavior.
  2. Write failing (RED) tests in `__tests__` directories.
  3. Wait for user approval.
  4. Implement (GREEN) code.

### 2. Performance Optimization
- **Skill:** `vercel-react-best-practices`
- **Mandate:** Follow Vercel's 57 rules for React/Next.js performance.
- **Focus:** Eliminate waterfalls (`Promise.all`), optimize bundle size (direct imports), and minimize re-renders (`useMemo`, `useCallback` appropriately).

### 3. Design & Accessibility
- **Skill:** `web-design-guidelines`
- **Mandate:** Ensure UI/UX consistency and WCAG compliance.
- **Action:** Use this skill to review any new UI components or layout changes.

## 📂 Project Structure & Conventions

- **Path Aliases:** Always use `@/` for `src/` directory imports.
- **Components:** Reusable UI primitives in `src/components/ui`. Feature components in `src/components/[feature]`.
- **Routing:** Define routes in `src/routes/`. TanStack Router handles the route tree generation.
- **Tests:** Place tests in `__tests__` folders adjacent to the source file. Use `[filename].test.tsx`.
- **Styling:** Use Tailwind v4 utility classes and the `cn()` utility for conditional classes.

## ⌨️ Common Commands

- **Check Code:** `bun run check` (Runs Biome lint/format/import-sort).
- **Run Tests:** `bun run test:run` (One-time test execution).
- **Dev Server:** `bun run dev`.

## 🤖 Workflow Expectations

1. **Discovery:** Use `grep_search` and `read_file` to understand existing patterns before suggesting changes.
2. **Plan:** Propose a plan that includes the TDD phases.
3. **Execution:** Strictly follow the TDD workflow.
4. **Verification:** After implementation, run `bun run check` and `bun run test:run` to ensure no regressions and compliance with standards.

---
*Refer to `GEMINI.md` for a deeper overview of the project architecture and `package.json` for full dependency details.*
