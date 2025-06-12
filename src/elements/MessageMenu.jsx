import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { ErrorContext } from "../context/ErrorContext";

const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_HTTP;

const MessageMenu = ({
  messageData,
  messageIndex,
  setMessageText,
  setMessageToChangeData,
  setMessageMenu,
  setMessageReplyTo,
}) => {
  const { currentUser } = useContext(AuthContext);
  const [isMakingChanges, setIsMakingChanges] = useState(false);
  const [isChoosingEmoji, setIsChoosingEmoji] = useState(false);
  const [isReactionsRollout, setIsReactionsRollout] = useState(false);
  const { setIsErrorExists, setErrorTxt } = useContext(ErrorContext);

  const mainRef = useRef(null);
  const handleDeleteMessage = async (e) => {
    try {
      e.stopPropagation();
      setMessageMenu({ messageId: null, isHidden: true });
      setIsMakingChanges(true);
      const res = await axios.get(
        `${backendUrl}/api/messages/deleteMessage?id=${messageData.id}`
      );
      setIsMakingChanges(false);
    } catch (err) {
      console.log(err);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };

  const handleChangeMessage = () => {
    setMessageText(messageData.text);
    setMessageToChangeData({ id: messageData.id, index: messageIndex });
    setMessageReplyTo({});
  };

  const handleSetAsAReply = () => {
    setMessageReplyTo({ id: messageData.id, index: messageIndex });
    setMessageToChangeData({});
  };

  const handleSendEmoji = async (e) => {
    try {
      const res = await axios.post(`${backendUrl}/api/messages/setReaction`, {
        emoji: e.target.innerHTML,
        messageId: messageData.id,
        chatId: messageData.chatId,
        userId: currentUser.id,
      });
    } catch (err) {
      console.log(err);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };
  return (
    <div
      className={isReactionsRollout ? "message-menu rollout" : "message-menu"}
      onClick={(e) => {
        // e.stopPropagation();
        // setMessageMenu({ messageId: null, isHidden: true });
      }}
    >
      {currentUser.id === messageData.userId ? (
        <div
          className="message-menu__container"
          style={isMakingChanges ? { pointerEvents: "none" } : {}}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteMessage(e),
                setMessageMenu({ messageId: null, isHidden: true });
            }}
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleChangeMessage(e),
                setMessageMenu({ messageId: null, isHidden: true });
            }}
          >
            Change
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSetAsAReply(e),
                setMessageMenu({ messageId: null, isHidden: true });
            }}
          >
            Reply
          </button>
        </div>
      ) : !isChoosingEmoji ? (
        <div className="message-menu__container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSetAsAReply(e);
              setMessageMenu({ messageId: null, isHidden: true });
            }}
          >
            Reply
          </button>
          <button onClick={() => setIsChoosingEmoji(true)}>React</button>
        </div>
      ) : (
        <div
          className="chat__message-reactions-menu-container"
          onClick={(e) => {
            e.stopPropagation();
            setMessageMenu({ messageId: null, isHidden: true });
          }}
        >
          <div
            className={
              isReactionsRollout
                ? "chat__message-reactions-menu rollout"
                : "chat__message-reactions-menu"
            }
          >
            {[..."👋🤚🖐👌🖕👇👍👎"].map((emoji, index) => {
              if (index < 4 && !isReactionsRollout)
                return (
                  <button key={index} onClick={handleSendEmoji}>
                    {emoji}
                  </button>
                );
              if (isReactionsRollout)
                return (
                  <button key={index} onClick={handleSendEmoji}>
                    {emoji}
                  </button>
                );
            })}
          </div>
          <button
            className="chat__message-reactions-rollout-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsReactionsRollout((prev) => !prev);
            }}
          >
            {isReactionsRollout ? <span>&#10224;</span> : <span>&#10225;</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageMenu;
