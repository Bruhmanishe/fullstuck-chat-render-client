import React from "react";
import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";

const Error = () => {
  const { errorTxt, setIsErrorExists } = useContext(ErrorContext);
  console.log(errorTxt);
  return (
    <div className="error__container">
      <div className="error__menu">
        <button
          className="error__close-btn"
          onClick={() => {
            setIsErrorExists(false);
          }}
        >
          X
        </button>
      </div>
      <div className="error__text">{errorTxt || "error text template"}</div>
    </div>
  );
};

export default Error;
