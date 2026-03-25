import { createBrowserRouter } from "react-router";
import Protected from "../features/auth/components/Protected.jsx";
import Dashboard from "../features/chat/pages/Dashboard.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Protected,
    children: [{ index: true, Component: Dashboard }],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
]);
