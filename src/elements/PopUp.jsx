import React from "react";

const PopUp = ({ funcToExecute, text, setIsPopUpHidden }) => {
  return (
    <div className="popup">
      <div className="popup__container">
        <h3>{text}</h3>
        <div className="popup__options">
          <button onClick={() => setIsPopUpHidden(true)}>NO</button>
          <button onClick={funcToExecute}>YES</button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
