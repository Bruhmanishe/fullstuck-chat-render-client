import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_HTTP;

const Register = () => {
  const [user, setUser] = useState({});
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api//auth/register`, user);
      navigate("/");
    } catch (err) {
      console.log(err);
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
    </div>
  );
};

export default Register;
