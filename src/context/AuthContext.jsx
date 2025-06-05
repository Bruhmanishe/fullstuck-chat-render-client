import axios from "axios";
import React, { createContext, useState } from "react";
import useWebSocket from "react-use-websocket";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const {
    lastJsonMesage,
    sendJsonMessage,
    readyState,
    lastMessage,
    sendMessage,
  } = useWebSocket("/chat?user=" + (currentUser?.id || null), {});
  const login = async (inputs) => {
    try {
      const res = await axios.post("/api/api/auth/login", inputs);
      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      return res;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  const logout = async () => {
    try {
      const res = await axios.get("/api/api/auth/logout");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
