import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/lib/i18n";
import { setUnauthorizedCallback } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import App from "./App.tsx";
import { router } from "./router";

// Setup global 401 handler
setUnauthorizedCallback(() => {
  useAuthStore.getState().reset();
  router.navigate({ to: "/login" });
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
