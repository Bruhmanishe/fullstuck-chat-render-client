import React, { useEffect } from "react";
import userDefaultIcon from "../assets/user-logo-default.png";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_WS;

const UserProfile = ({
  userData,
  isUserProfileHidden,
  setIsUserProfileHidden,
  chat,
  setIsChatClosed,
  handleGetChats,
  chatId,
}) => {
  const { currentUser } = useContext(AuthContext);
  const { setIsErrorExists, setErrorTxt } = useContext(ErrorContext);
  const handleDelteChat = async () => {
    try {
      console.log(chat);
      const res = axios.post(`${backendUrl}/api/chats/deleteChat`, {
        userId: currentUser.id,
        chatId,
      });
      setIsUserProfileHidden(true);
      setIsChatClosed(true);
      handleGetChats();
    } catch (err) {
      console.log(err);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };
  return (
    <section
      className={isUserProfileHidden ? "user-profile hidden" : "user-profile"}
    >
      <button onClick={() => setIsUserProfileHidden(true)}>X</button>
      <div className="user-profile__container">
        <div className="user-profile__main">
          <div className="user-profile__icon">
            <img src={userData?.img || userDefaultIcon} alt="" />
          </div>
          <h3 className="user-profile__usaername">{userData?.username}</h3>
        </div>
        <div className="user-profile__info">
          <p>Email: {userData?.email}</p>
        </div>
        <div className="user-profile__settings">
          <button
            className="user-profile__delete-chat-btn"
            onClick={handleDelteChat}
          >
            Delte Chat
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
