import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../elements/Loading";
import Error from "../elements/Error";
import { ErrorContext } from "../context/ErrorContext";
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_HTTP;

const Register = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { isErrorExists, setIsErrorExists, setErrorTxt } =
    useContext(ErrorContext);

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${backendUrl}/api/auth/register`, user);
      setIsLoading(false);
      navigation("/verify");
    } catch (err) {
      console.log(err);
      setErrorTxt(err.response.data);
      setIsErrorExists(true);
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
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
            type="text"
            name="username"
            placeholder="Your name"
            onChange={handleChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Your email"
            onChange={handleChange}
          />
          <input
            type="text"
            name="password"
            placeholder="Your password"
            onChange={handleChange}
          />
          <button onClick={() => handleClick()}>Register</button>
        </form>
      ) : (
        <Loading />
      )}
      {isErrorExists && <Error />}
    </div>
  );
};

export default Register;
