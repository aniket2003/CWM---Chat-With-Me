import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import PageNotFound from "./pages/PageNotFound";
import PersistLogin from "./redux/auth/PersistLogin";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SocketProvider } from "./context/SocketContext";
const client_id = '97244884093-a86phhes9003egmbrlc8b3acr3iogqrj.apps.googleusercontent.com';
function App() {

  const GoogleAuthWrapperLogin = ()=>{
    return (
      <GoogleOAuthProvider clientId={client_id}>
        <Login></Login>
      </GoogleOAuthProvider>
    )
  }

  const GoogleAuthWrapperRegister = ()=>{
    return (
      <GoogleOAuthProvider clientId={client_id}>
        <Register></Register>
      </GoogleOAuthProvider>
    )
  }

  const router = createBrowserRouter([
    {
      path: ["/login", "/"],
      element: <GoogleAuthWrapperLogin/>,
    },
    {
      path: "/register",
      element: <GoogleAuthWrapperRegister/>,
    },
    {
      path: "/",
      element: <PersistLogin />, // Using PersistLogin to wrap protected routes
      children: [
        {
          path: "chat",
          element: <Chat />,
        },
        // Add other protected routes here
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  // if(currentUser === null && (location.pathname === '/chat')){
  //   console.log(currentUser);
  //   return <Loader/>
  // }

  return (
    <>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
    </>
  );
}

export default App;

