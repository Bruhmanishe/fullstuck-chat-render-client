import axios from "axios";
import React, { createContext, useState } from "react";
import { useContext } from "react";
import useWebSocket from "react-use-websocket";
import { ErrorContext } from "./ErrorContext";
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_WS;
console.log(backendUrl);

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { isErrorExists, setIsErrorExists, setErrorTxt } =
    useContext(ErrorContext);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const {
    lastJsonMesage,
    sendJsonMessage,
    readyState,
    lastMessage,
    sendMessage,
  } = useWebSocket(`${backendUrlWS}?user=` + (currentUser?.id || null), {});
  const login = async (inputs) => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/login`, inputs);
      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      return res;
    } catch (err) {
      console.log(err);
      setErrorTxt(err.response.data);
      setIsErrorExists(true);
      return err;
    }
  };
  const logout = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/auth/logout`);
      setCurrentUser(null);
      localStorage.clear("user");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        lastJsonMesage,
        sendJsonMessage,
        lastMessage,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
