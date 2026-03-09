# hr-frontend

**hr-frontend** is a modern human resources management frontend web application.

## Tech Stack

- **Framework:** React 19 + TypeScript (~5.9) + Vite (using Rolldown)
- **Runtime:** Bun
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix UI primitives)
- **State Management:** Zustand (Global UI), TanStack Query (Server State)
- **Routing:** TanStack Router
- **Forms:** react-hook-form + zod
- **Testing:** Vitest + React Testing Library + jsdom

## Development Workflow

### Requirements

- [Bun](https://bun.sh/) is used as the runtime and package manager.

### Commands

The project provides the following key scripts:

- **Start Dev Server:** `bun run dev`
- **Build for Production:** `bun run build`
- **Lint Code:** `bun run lint` (Uses Biome)
- **Format Code:** `bun run format` (Uses Biome)
- **Check & Fix:** `bun run check` (Uses Biome)
- **Run Tests:** `bun run test` (Watch mode)
- **Run Tests Once:** `bun run test:run`
- **Test Coverage:** `bun run test:coverage`
- **Preview Build:** `bun run preview`
- **Run Pre-commit Hooks:** `bun run prek`
- **Install Hooks:** `bun run prepare`

## Documentation & AI Guidelines

This repository includes detailed guidelines for developers and AI agents (such as Claude, Gemini, or Cursor):

- [README.md](./README.md): Basic project overview (this file).
- [AGENT.md](./AGENT.md): Key instructions, core mandates (TDD, Performance), and project conventions.
- [GEMINI.md](./GEMINI.md): Comprehensive project architecture, detailed tech stack, layout, and conventions.
- [CLAUDE.md](./CLAUDE.md): Quick reference and development guidelines for Claude/AI.

Please refer to these files to ensure code quality standards, consistent architecture, and TDD-first principles are strictly followed.
