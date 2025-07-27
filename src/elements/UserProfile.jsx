import React, { useEffect, useState } from "react";
import userDefaultIcon from "../assets/user-logo-default.png";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";
import PopUp from "./PopUp";
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
  const [isPopUpHidden, setIsPopUpHidden] = useState(true);
  const [isBlockUser, setIsBlockUser] = useState(false);

  const handleDelteChat = async () => {
    try {
      console.log(chat);
      const res = await axios.post(`${backendUrl}/api/chats/deleteChat`, {
        userId: currentUser.id,
        chatId,
      });
      setTimeout(() => {
        handleGetChats();
        setIsUserProfileHidden(true);
        setIsChatClosed(true);
      }, 1000);
    } catch (err) {
      console.log(err);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };
  const handleBlockUser = async () => {
    try {
      console.log(userData);
      const res = await axios.post(`${backendUrl}/api/users/blockUser`, {
        userId: currentUser.id,
        blockedUserId: userData.id,
      });
      setTimeout(() => {
        handleGetChats();
        setIsUserProfileHidden(true);
        setIsChatClosed(true);
      }, 1000);
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
      <button
        className="user-profile__close-btn"
        onClick={() => setIsUserProfileHidden(true)}
      >
        X
      </button>
      <div className="user-profile__container">
        <div className="user-profile__main">
          <div className="user-profile__icon">
            <img src={userData?.iconUrl || userDefaultIcon} alt="" />
          </div>
          <h3 className="user-profile__username">{userData?.username}</h3>
        </div>
        <div className="user-profile__info">
          <p>Email: {userData?.email}</p>
        </div>
        <div className="user-profile__settings">
          <button
            className="user-profile__delete-chat-btn"
            onClick={() => {
              setIsPopUpHidden((prev) => !prev);
              setIsBlockUser(false);
            }}
          >
            Delte Chat
          </button>
          <button
            className="user-profile__delete-chat-btn"
            onClick={() => {
              setIsPopUpHidden((prev) => !prev);
              setIsBlockUser(true);
            }}
          >
            Block User
          </button>
        </div>
      </div>
      {!isPopUpHidden && (
        <PopUp
          funcToExecute={!isBlockUser ? handleDelteChat : handleBlockUser}
          text={
            "Are you sure that you want to delete chat with " +
            userData?.username +
            "?"
          }
          setIsPopUpHidden={setIsPopUpHidden}
        />
      )}
    </section>
  );
};

export default UserProfile;
