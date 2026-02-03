import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@/lib/i18n'
import App from './App.tsx'
import { setUnauthorizedCallback } from '@/lib/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { router } from './router'

// Setup global 401 handler
setUnauthorizedCallback(() => {
  useAuthStore.getState().reset();
  router.navigate({ to: '/login' });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
