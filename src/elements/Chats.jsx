import React, { useContext, useEffect, useState } from "react";
import chatIcon from "../assets/chat-icon.png";
import userDefaultIcon from "../assets/user-logo-default.png";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Chat from "./Chat";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "./Loading";
import notifSound from "../sounds/message-recieve-01.mp3";
import { ErrorContext } from "../context/ErrorContext";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatListClosed, setIsChatListClosed] = useState(true);
  const [isChatClosed, setIsChatClosed] = useState(true);
  const [usersOnline, setUsersOnline] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
  const backendUrlWS = import.meta.env.VITE_BACKEND_WS;
  const { setIsErrorExists, setErrorTxt } = useContext(ErrorContext);

  const { currentUser, lastMessage, lastJsonMesage } = useContext(AuthContext);
  const handleGetChats = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/chats/getChats?userId=` + currentUser.id
      );
      const data = [...res.data].map((chat) => {
        if (chat?.lastMessage?.date) {
          const redMessageText =
            chat.lastMessage.text.length > 15
              ? chat.lastMessage.text.slice(0, 15) + "..."
              : chat.lastMessage.text;
          chat.lastMessage.text = redMessageText;
        }

        return chat;
      });
      setChats(data);
      setIsLoading(false);
    } catch (err) {
      if (err.status !== 404) return setChats(null);
      setChats([]);
      console.log(err, chats);
      setIsLoading(false);
      // setIsErrorExists(true);
      // setErrorTxt(err.response.data);
    }
  };

  useEffect(() => {
    handleGetChats();
  }, []);

  useEffect(() => {
    if (!lastMessage) return;
    if (JSON.parse(lastMessage?.data)[0] == "error")
      return console.log(JSON.parse(lastMessage?.data)[1]);
    const eventName = JSON.parse(lastMessage?.data)[0];
    if (eventName === "sendNotification") {
      console.log("Notifications recieved");
      const unreadNotifications = JSON.parse(lastMessage.data)[1].filter(
        (notif) => {
          if (notif.isRead === 0) return notif;
        }
      );
      if (JSON.parse(lastMessage.data)[1].length > notifications.length) {
        const newNotificationSound = new Audio();
        newNotificationSound.src = notifSound;
        newNotificationSound.volume = 0.3;
        newNotificationSound.play();
      }
      setNotifications(JSON.parse(lastMessage.data)[1]);
      setUnreadNotifications(unreadNotifications);
    }
    if (eventName === "sendUsersOnline") {
      console.log(JSON.parse(lastMessage?.data)[1]);
      setUsersOnline(JSON.parse(lastMessage?.data)[1]);
    }
  }, [lastMessage]);

  useEffect(() => {
    console.log(usersOnline);
  }, [usersOnline]);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  return (
    <section className="chats">
      <button
        className="chats__btn"
        onClick={() => {
          setIsChatListClosed(false);
          handleGetChats();
        }}
      >
        {unreadNotifications.length > 0 && (
          <div className="chats__notifications">
            {
              unreadNotifications.filter((notif, index) => {
                if (!unreadNotifications[index - 1]?.chatId) return notif;
                if (unreadNotifications[index - 1]?.chatId !== notif.chatId)
                  return notif;
              }).length
            }
          </div>
        )}
        <img src={chatIcon} alt="" />
      </button>
      {!isChatListClosed && (
        <div className="chats__container">
          {
            <div className="chats__menu">
              {!isChatClosed && (
                <div
                  className="chats__btn-back"
                  onClick={() => setIsChatClosed(true)}
                >
                  <button>&#9756;</button>
                </div>
              )}
              <div
                className="chats__btn-close"
                onClick={() => setIsChatListClosed(true)}
              >
                <button>X</button>
              </div>
            </div>
          }
          {isChatClosed ? (
            isLoading ? (
              <Loading />
            ) : (
              <div className="chats__list">
                {!chats ? (
                  <p>Sorry! no server connection</p>
                ) : chats.length < 1 ? (
                  <p>You dont have any chats yet!</p>
                ) : (
                  chats.map((chat) => {
                    return (
                      <div
                        key={chat.chatId}
                        className="chats__element"
                        onClick={() => {
                          setIsChatClosed(false);
                          setChat({ chatId: chat.chatId });
                          console.log(chat.chatId);
                        }}
                      >
                        <div
                          className={
                            usersOnline[chat.id]
                              ? "chats__icon user-online"
                              : "chats__icon"
                          }
                        >
                          <img src={chat.icon || userDefaultIcon} alt="" />
                        </div>
                        <div className="chats__data">
                          <h4>{chat.username}</h4>
                          <div className="chats__last-message">
                            <p>{chat.lastMessage?.text || ""}</p>
                            <p>
                              {(chat?.lastMessage?.date &&
                                `${
                                  chat.lastMessage.date
                                    .split(" ")[1]
                                    .split(":")[0]
                                }:${
                                  chat.lastMessage.date
                                    .split(" ")[1]
                                    .split(":")[1]
                                }`) ||
                                ""}
                            </p>
                          </div>
                        </div>
                        {unreadNotifications.length > 0 &&
                          unreadNotifications.map((notification) => {
                            if (notification.chatId === chat.chatId)
                              return (
                                <div
                                  className="chats__element-notif"
                                  key={notification.id}
                                >
                                  {unreadNotifications.filter((notif) => {
                                    if (notif.chatId === chat.chatId)
                                      return notif;
                                  }).length <= 10
                                    ? unreadNotifications.filter((notif) => {
                                        if (notif.chatId === chat.chatId)
                                          return notif;
                                      }).length
                                    : "10+"}
                                </div>
                              );
                          })}
                      </div>
                    );
                  })
                )}
              </div>
            )
          ) : (
            <Chat
              chatId={chat.chatId}
              notifications={notifications}
              usersOnline={usersOnline}
              setIsChatClosed={setIsChatClosed}
              handleGetChats={handleGetChats}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default Chats;
