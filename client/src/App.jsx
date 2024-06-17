import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import PersistLogin from "./auth/PersistLogin";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    // {
    //   path: "/chat",
    //   element: <Chat />,
    // },
    {
      path: "/",
      element: <PersistLogin />, // Use PersistLogin to wrap protected routes
      children: [
        {
          path: "chat",
          element: <Chat />,
        },
        // Add other protected routes here
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
