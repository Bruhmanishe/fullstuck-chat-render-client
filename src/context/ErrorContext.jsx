import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const ErrorContext = createContext();

const ErrorContextProvider = ({ children }) => {
  const [errorTxt, setErrorTxt] = useState("");
  const [isErrorExists, setIsErrorExists] = useState(false);
  useEffect(() => {
    if (isErrorExists)
      setTimeout(() => {
        setIsErrorExists(false);
      }, 2000);
  }, [isErrorExists]);
  return (
    <ErrorContext.Provider
      value={{ setErrorTxt, errorTxt, setIsErrorExists, isErrorExists }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContextProvider;
