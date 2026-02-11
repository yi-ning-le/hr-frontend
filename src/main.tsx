import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/lib/i18n";
import { setUnauthorizedCallback } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/useAuthStore";
import App from "./App.tsx";
import { router } from "./router";

// Setup global 401 handler
setUnauthorizedCallback(() => {
  queryClient.clear();
  useAuthStore.getState().reset();
  router.navigate({ to: "/login" });
});

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}
