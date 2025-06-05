import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import useWebSocket from "react-use-websocket";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({});
  const { login, currentUser } = useContext(AuthContext);
  const { lastJsonMesage, sendJsonMessage, readyState, lastMessage } =
    useWebSocket("/chat", { queryParams: { room: 10 } });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleClick = async () => {
    try {
      const res = await login(user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser]);
  return (
    <div className="auth__container">
      <form
        className="auth__form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          className="auth__input"
          type="text"
          name="email"
          placeholder="Your email"
          onChange={handleChange}
        />
        <input
          className="auth__input"
          type="text"
          name="password"
          placeholder="Your password"
          onChange={handleChange}
        />
        <button onClick={handleClick}>Login</button>
        <p style={{ color: "#eee" }}>
          Dont have an account yet? <Link to={"/register"}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
