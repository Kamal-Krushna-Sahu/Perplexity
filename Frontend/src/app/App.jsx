import { RouterProvider } from "react-router";
import { router } from "./app.routes.js";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { useEffect } from "react";

function App() {
  const { handleGetMe } = useAuth();

  // hydrate user on page reload
  useEffect(() => {
    handleGetMe();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
