import { RouterProvider } from "@tanstack/react-router";
import { useAuthHeartbeat } from "@/hooks/useAuthHeartbeat";
import { router } from "./router";

function App() {
  useAuthHeartbeat();
  return <RouterProvider router={router} />;
}

export default App;
