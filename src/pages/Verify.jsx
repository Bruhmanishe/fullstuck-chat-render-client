import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorContext } from "../context/ErrorContext";
import Error from "../elements/Error";
import Loading from "../elements/Loading";
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_HTTP;

const Verify = () => {
  const { isErrorExists, setIsErrorExists, setErrorTxt } =
    useContext(ErrorContext);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const navigation = useNavigate();
  const handleSendVerify = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/auth/verify?code=` + code
      );
      setIsLoading(false);
      navigation("/login");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };
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
            name="code"
            placeholder="Your password"
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
          <button onClick={handleSendVerify}>SEND</button>
        </form>
      ) : (
        <Loading />
      )}
      {isErrorExists && <Error />}
    </div>
  );
};

export default Verify;
