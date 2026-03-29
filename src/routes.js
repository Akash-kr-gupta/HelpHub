// frontend/src/routes.js

import React from "react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RequestHelp from "./pages/RequestHelp";
import Profile from "./pages/Profile";

// This is for the React Router v6 style when you prefer config‑centric routes
// You can import this into App.js or use it with createBrowserRouter if you switch later

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/request",
    element: <RequestHelp />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
];

export default routes;