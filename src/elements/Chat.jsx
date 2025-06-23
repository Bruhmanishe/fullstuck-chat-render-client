import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import userDefaultIcon from "../assets/user-logo-default.png";
import UserProfile from "./UserProfile";
import MessageMenu from "./MessageMenu";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import { ErrorContext } from "../context/ErrorContext";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_WS;

const Chat = ({
  chatId,
  notifications,
  usersOnline,
  setIsChatClosed,
  handleGetChats,
}) => {
  const [chat, setChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messageReplyTo, setMessageReplyTo] = useState({});
  const [isInputsDisabled, setIsInputsDisabled] = useState(false);
  const [isUpdateWithoutScroll, setIsUpdateWithoutScroll] = useState(false);

  const [maxMessages, setMaxMessages] = useState(8);
  const [isUserProfileHidden, setIsUserProfileHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [messageMenu, setMessageMenu] = useState({
    messageId: null,
    isHidden: true,
  });
  const [messageToChangeData, setMessageToChangeData] = useState({});
  const lastMessageRef = useRef(null);
  const chatWindowRef = useRef(null);
  const scrollToReplyRef = useRef(null);
  const [scrollToReply, setScrollToReply] = useState(null);
  const { setIsErrorExists, setErrorTxt } = useContext(ErrorContext);

  const { currentUser, lastMessage } = useContext(AuthContext);
  const handleGetChatData = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/chats/getChat?chatId=${chatId}&userId=${currentUser.id}`
      );
      setChat(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };

  const handleChatWindowScroll = (e) => {
    if (e.target.scrollTop < 2 && maxMessages <= chat.messages.length)
      setMaxMessages((prev) => prev + 1),
        e.target.scrollTo({ left: 0, top: 20, behavior: "smooth" });
  };

  const handleSendChangedMessage = async (e) => {
    e.preventDefault();
    if (messageText.length < 1) return;
    try {
      const res = await axios.post(`${backendUrl}/api/messages/changeMessage`, {
        id: messageToChangeData.id,
        text: messageText,
      });
      setMessageToChangeData({});
      setMessageText("");
    } catch (err) {
      console.log(err);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setIsInputsDisabled(true);
      const res = await axios.post(`${backendUrl}/api/messages/sendMessage`, {
        text: messageText,
        chatId,
        userId: currentUser.id,
        replyTo: messageReplyTo.id,
      });
      setIsInputsDisabled(false);
      setMessageToChangeData({});
      setMessageReplyTo({});
      setMessageText("");
    } catch (err) {
      console.log(err);
      setIsInputsDisabled(true);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };

  const handleChange = (e) => {
    setMessageText(e.target.value);
    console.log(e.target.value);
  };

  const handleMarkReadNotifications = async () => {
    if (notifications?.length < 1) return;
    const chatNotifications = [...notifications].filter((notif) => {
      if (notif.chatId === chatId && notif.isRead === 0) return notif;
    });
    if (chatNotifications.length < 1) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/chats/markReadNotifications`,
        {
          notifications: chatNotifications,
          userId: currentUser.id,
        }
      );
    } catch (err) {
      console.log(err);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };

  useEffect(() => {
    handleGetChatData();
  }, [chatId]);

  useEffect(() => {
    if (!lastMessage) return;
    const eventName = JSON.parse(lastMessage?.data)[0];
    if (eventName === "getMessage") {
      const newMessage = JSON.parse(JSON.parse(lastMessage?.data)[1]);
      if (!chat?.messages) return;
      const messages = [...chat.messages];
      messages.push(newMessage);
      handleMarkReadNotifications();
      setIsUpdateWithoutScroll(false);
      setChat((prev) => {
        return {
          user: prev.user,
          messages: messages,
        };
      });
    }
    if (eventName === "updateMessages") {
      setIsUpdateWithoutScroll(false);
      handleGetChatData();
    }
    if (eventName === "updateReactions") {
      setIsUpdateWithoutScroll(true);
      handleGetChatData();
    }
  }, [lastMessage]);

  useEffect(() => {
    if (lastMessageRef.current && !isUpdateWithoutScroll)
      lastMessageRef.current.scrollIntoView();
  }, [chat]);

  useEffect(() => {
    function scrollIfOutOfBounds() {
      if (scrollToReplyRef.current)
        return scrollToReplyRef.current.scrollIntoView({ behavior: "smooth" });
      setMaxMessages((prev) => prev + 30);
      setTimeout(() => scrollIfOutOfBounds(), 200);
    }
    if (scrollToReply) scrollIfOutOfBounds();
  }, [scrollToReplyRef, scrollToReply]);

  return (
    <div className="chat" onLoad={handleMarkReadNotifications}>
      <div
        className="chat__header"
        onClick={() => {
          setIsUserProfileHidden(false);
        }}
      >
        <div
          className={
            usersOnline[chat?.user?.id]
              ? "chat__header-icon user-online"
              : "chat__header-icon"
          }
        >
          {isLoading ? (
            <Loading />
          ) : (
            <img src={chat?.user?.img || userDefaultIcon} />
          )}
        </div>
        <div className="chat__header-name">{chat?.user?.username}</div>
      </div>
      <div
        className="chat__window"
        ref={chatWindowRef}
        onScroll={handleChatWindowScroll}
        onClick={(e) => {
          !messageMenu.isHidden &&
            setMessageMenu({ messageId: null, isHidden: true });
        }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <div
            className="chat__messages-container"
            onClick={(e) => {
              !messageMenu.isHidden &&
                setMessageMenu({ messageId: null, isHidden: true });
            }}
          >
            {chat?.messages?.length > 0 ? (
              chat.messages.map((message, index) => {
                if (index > chat.messages.length - maxMessages)
                  return (
                    <div
                      className={
                        message.id === scrollToReply
                          ? "chat__message-container replied"
                          : "chat__message-container"
                      }
                      key={message.id}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setMessageMenu((prev) => {
                            return { messageId: message.id, isHidden: false };
                          });
                        }}
                        className={
                          currentUser.id === message.userId
                            ? "chat__message-from chat__message"
                            : "chat__message"
                        }
                        ref={
                          chat.messages.length - 1 === index
                            ? lastMessageRef
                            : message?.id === scrollToReply
                            ? scrollToReplyRef
                            : null
                        }
                      >
                        {message.replyTo &&
                          chat.messages.filter(
                            (mes) => mes?.id === message.replyTo
                          )[0] && (
                            <div
                              className="chat__message-reply"
                              onClick={(e) => {
                                e.stopPropagation();
                                setScrollToReply((prev) => {
                                  if (
                                    chat.messages.filter(
                                      (mes) => mes.id === message.replyTo
                                    )[0]?.id === prev
                                  ) {
                                    scrollToReplyRef.current.scrollIntoView();
                                    return prev;
                                  } else {
                                    return chat.messages.filter(
                                      (mes) => mes.id === message.replyTo
                                    )[0]?.id;
                                  }
                                });
                              }}
                            >
                              <p className="chat__message-reply-text">
                                {`"${
                                  chat.messages.filter(
                                    (mes) => mes?.id === message?.replyTo
                                  )[0]?.text
                                }"`}
                              </p>
                            </div>
                          )}
                        <p
                          className="chat__message-text"
                          dangerouslySetInnerHTML={{ __html: message.text }}
                        ></p>
                        <p className="chat__message-time">
                          {`${message.date.split(" ")[1].split(":")[0]}:${
                            message.date.split(" ")[1].split(":")[1]
                          }`}
                          {message.isChanged > 0 && "(changed)"}
                        </p>

                        {!messageMenu.isHidden &&
                          messageMenu.messageId === message.id && (
                            <MessageMenu
                              messageData={message}
                              setMessageText={setMessageText}
                              messageIndex={index}
                              setMessageToChangeData={setMessageToChangeData}
                              setMessageMenu={setMessageMenu}
                              setMessageReplyTo={setMessageReplyTo}
                            />
                          )}
                        {message?.reactions && (
                          <div className="reactions__container">
                            {[..."👋🤚🖐👌🖕👇👍👎"].map((emoji, index) => {
                              let reacNum = 0;
                              message.reactions.forEach((rec) => {
                                if (rec.emoji === emoji) reacNum++;
                              });

                              if (reacNum > 0)
                                return (
                                  <div
                                    className={
                                      message.reactions.filter((rec) => {
                                        if (rec.userId === currentUser.id)
                                          return rec;
                                      }).length > 0
                                        ? "reactions__element chosen"
                                        : "reactions__element"
                                    }
                                    key={index}
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      try {
                                        e.target.style.pointerEvents = "none";
                                        e.target.style.opacity = "0.4";

                                        const res = await axios.post(
                                          `${backendUrl}/api/messages/setReaction`,
                                          {
                                            emoji: emoji,
                                            messageId: message.id,
                                            chatId: message.chatId,
                                            userId: currentUser.id,
                                          }
                                        );
                                        e.target.style.pointerEvents = "all";
                                        e.target.style.opacity = "1.5";
                                      } catch (err) {
                                        console.log(err);
                                        setIsErrorExists(true);
                                        setErrorTxt(err.response.data);
                                        e.target.style.pointerEvents = "all";
                                        e.target.style.opacity = "1.5";
                                      }
                                    }}
                                  >
                                    <p>{`${emoji}${
                                      reacNum > 1 ? reacNum : ""
                                    }`}</p>
                                  </div>
                                );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
              })
            ) : (
              <p>So far there is no messages! You can be first!</p>
            )}
          </div>
        )}
      </div>
      <form
        className="chat__inputs"
        style={isInputsDisabled ? { pointerEvents: "none", opacity: 0.5 } : {}}
      >
        {(messageToChangeData?.id || messageReplyTo?.id) && (
          <div className="reply">
            <div className="reply__message">
              <p>{messageReplyTo?.id ? "Reply to..." : "Changing..."}</p>
              <button
                onClick={() => {
                  messageReplyTo?.id
                    ? setMessageReplyTo({})
                    : setMessageToChangeData({}),
                    setMessageText("");
                }}
              >
                X
              </button>
            </div>
            <p>
              {chat.messages[
                messageReplyTo?.id
                  ? messageReplyTo.index
                  : messageToChangeData.index
              ].text.length > 15
                ? chat.messages[
                    messageReplyTo?.id
                      ? messageReplyTo.index
                      : messageToChangeData.index
                  ].text.slice(0, 15) + "..."
                : chat.messages[
                    messageReplyTo?.id
                      ? messageReplyTo.index
                      : messageToChangeData.index
                  ].text}
            </p>
          </div>
        )}
        <div className="chat__input">
          <ReactQuill
            theme="snow"
            value={messageText}
            onChange={setMessageText}
            modules={{ toolbar: false }}
            style={{ width: "100%", maxHeight: "100%" }}
          />
        </div>
        <div className="chat__btn-send">
          {!messageToChangeData?.id ? (
            <button onClick={handleClick}>&#10095;</button>
          ) : (
            <button onClick={handleSendChangedMessage}>&#x270E;</button>
          )}
        </div>
      </form>
      <UserProfile
        isUserProfileHidden={isUserProfileHidden}
        setIsUserProfileHidden={setIsUserProfileHidden}
        userData={chat?.user && chat.user}
        chat={chat}
        setIsChatClosed={setIsChatClosed}
        handleGetChats={handleGetChats}
        chatId={chatId}
      />
    </div>
  );
};

export default Chat;
