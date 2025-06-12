import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import useWebSocket from "react-use-websocket";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../elements/Loading";
import Error from "../elements/Error";
import { ErrorContext } from "../context/ErrorContext";
const backendUrlWS = import.meta.env.VITE_BACKEND_WS;
const backendUrl = import.meta.env.HTTP;

const Login = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { isErrorExists } = useContext(ErrorContext);
  const { login, currentUser } = useContext(AuthContext);
  const { lastJsonMesage, sendJsonMessage, readyState, lastMessage } =
    useWebSocket(backendUrl, { queryParams: { room: 10 } });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const res = await login(user);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser]);
  return (
    <div className="auth__container">
      {!isLoading ? (
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
      ) : (
        <Loading />
      )}
      {isErrorExists && <Error />}
    </div>
  );
};

export default Login;
