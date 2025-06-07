import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useWebSocket from "react-use-websocket";
import Loading from "../elements/Loading";

const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_HTTP;

const User = () => {
  const [user, setUser] = useState(null);
  const { currentUser, sendJsonMessage } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const handleGetUser = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/users/getUser` + location.search
      );
      setUser(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${backendUrl}/api/chats/createChat?toId=` +
          user.id +
          "&fromId=" +
          currentUser.id
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, [location]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser]);

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <h1>{user ? user.username : "text"}</h1>
          <form action="">
            <button onClick={handleClick}>Chat</button>
          </form>
        </div>
      )}
    </main>
  );
};

export default User;
