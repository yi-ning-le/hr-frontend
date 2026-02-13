/// <reference types="vitest/config" />

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/static": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom")) {
              return "vendor-react-dom";
            }
            if (
              id.includes("react") &&
              !id.includes("react-dom") &&
              !id.includes("react-big-calendar") &&
              !id.includes("react-pdf") &&
              !id.includes("recharts")
            ) {
              return "vendor-react";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }
            if (id.includes("react-pdf")) {
              return "vendor-pdf";
            }
            if (id.includes("react-big-calendar") || id.includes("date-fns")) {
              return "vendor-calendar";
            }
            if (id.includes("recharts")) {
              return "vendor-charts";
            }
            if (id.includes("i18next")) {
              return "vendor-i18n";
            }
            if (id.includes("@tanstack")) {
              return "vendor-router";
            }
            if (
              id.includes("react-hook-form") ||
              id.includes("zod") ||
              id.includes("@hookform")
            ) {
              return "vendor-form";
            }
            if (
              id.includes("axios") ||
              id.includes("zustand") ||
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("lucide-react") ||
              id.includes("sonner") ||
              id.includes("vaul") ||
              id.includes("input-otp") ||
              id.includes("embla-carousel") ||
              id.includes("react-resizable-panels") ||
              id.includes("@hello-pangea")
            ) {
              return "vendor-utils";
            }
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: true,
  },
});
