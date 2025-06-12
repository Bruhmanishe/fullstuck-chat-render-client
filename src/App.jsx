import { useContext, useEffect, useState } from "react";
import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import Register from "./pages/Register";
import axios from "axios";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Header from "./elements/Header";
import User from "./pages/User";
import { AuthContext } from "./context/AuthContext";
import Chats from "./elements/Chats";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_HTTP;
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_HTTP;

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Chats />
    </>
  );
};

const router = createBrowserRouter([
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/verify", element: <Verify /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/user", element: <User /> },
    ],
  },
]);

function App() {
  const { currentUser, logout, lastMessage } = useContext(AuthContext);

  useEffect(() => {
    const handleServerConnection = async () => {
      try {
        const res = await axios.get(`${backendUrl}/`);
      } catch (err) {
        if (err.status !== 401) return console.log(err);
        logout();
      }
    };
    handleServerConnection();
  }, []);

  useEffect(() => {}, [lastMessage]);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
