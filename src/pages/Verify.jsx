import axios from "axios";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorContext } from "../context/ErrorContext";
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_HTTP;

const Verify = () => {
  const { setIsErrorExists, setErrorTxt } = useContext(ErrorContext);
  const location = useLocation();
  const navigation = useNavigate();
  useEffect(() => {
    const handleSendVerify = async () => {
      try {
        const res = await axios.post(
          `${backendUrl}/api/auth/verify` + location.search
        );
        navigation("/login");
      } catch (err) {
        console.log(err);
        setIsErrorExists(true);
        setErrorTxt(err.response.data);
      }
    };
    handleSendVerify();
  }, [location]);
  return <div>Verify</div>;
};

export default Verify;
