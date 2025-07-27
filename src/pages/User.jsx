import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ErrorContext } from "../context/ErrorContext";
import userDefaultIcon from "../assets/user-logo-default.png";
import useWebSocket from "react-use-websocket";
import Loading from "../elements/Loading";

const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_HTTP;

const User = () => {
  const [user, setUser] = useState(null);
  const { currentUser, sendJsonMessage, setCurrentUser } =
    useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsErrorExists, setErrorTxt } = useContext(ErrorContext);
  const [isChangingIcon, setIsChangingIcon] = useState(false);
  const [icon, setIcon] = useState(null);
  const handleClickChangeIcon = async (e) => {
    try {
      setIsLoading(true);
      let formData = new FormData();
      formData.append("icon", icon);
      console.log(formData.entries());
      const config = {
        headers: { "content-type": "multipar/form-data" },
      };
      const res = await axios.post(
        backendUrl + "/api/upload/uploadIcon?userId=" + currentUser.id,
        formData,
        config
      );
      setIsLoading(false);
      await handleGetUser();
      setIsChangingIcon(false);
      setIcon(null);
      setCurrentUser((prev) => {
        return { ...prev, iconUrl: user.iconUrl };
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  const handleGetUser = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/users/getUser` +
          location.search +
          "&currentUserId=" +
          currentUser.id
      );
      setUser(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/chats/createChat?toId=` +
          user.id +
          "&fromId=" +
          currentUser.id
      );
      console.log(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async (e) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        backendUrl +
          "/api/users/unblockUser?blockedUserId=" +
          user?.id +
          "&userId=" +
          currentUser.id
      );
      setIsLoading(false);
      user.isBlockedUser = false;
    } catch (err) {
      console.log(err);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, [location]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    if (!currentUser) navigate("/login");
    if (currentUser?.id === user?.id)
      setCurrentUser((prev) => {
        return { ...prev, iconUrl: user.iconUrl };
      });
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="userpage">
          <div className="userpage__icon">
            <img
              src={user.iconUrl || userDefaultIcon}
              alt=""
              width={"1000px"}
              height={"1000px"}
            />
            {currentUser.id === user.id && (
              <button
                onClick={() => setIsChangingIcon(true)}
                className="userpage__change-icon"
              >
                &#x270E;
              </button>
            )}
          </div>
          <h1>{user ? user.username : "text"}</h1>
          <form action="">
            <button onClick={handleClick}>Chat</button>
            {user.isBlockedUser && (
              <button onClick={handleUnblockUser}>Unblock</button>
            )}
          </form>
          {isChangingIcon &&
            (!isLoading ? (
              <div className="userpage__icon-redactor">
                <button
                  className="userpage__icon-upload-close-btn"
                  onClick={() => {
                    setIsChangingIcon(false);
                    setIcon(null);
                  }}
                >
                  X
                </button>
                <button
                  className="userpage__icon-upload-btn"
                  onClick={(e) => {
                    e.currentTarget.querySelector("input").click();
                  }}
                >
                  <img
                    className="userpage__icon-dispaly"
                    src={
                      !icon
                        ? user.iconUrl || userDefaultIcon
                        : URL.createObjectURL(icon)
                    }
                  />
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      setIcon(e.target.files[0]);
                    }}
                  />
                </button>
                {icon && (
                  <button
                    className="userpage__icon-upload"
                    onClick={handleClickChangeIcon}
                  >
                    ✔
                  </button>
                )}
              </div>
            ) : (
              <Loading />
            ))}
        </div>
      )}
    </main>
  );
};

export default User;
