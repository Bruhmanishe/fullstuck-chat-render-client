import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import searchIcon from "../assets/search.png";
import userDefaultIcon from "../assets/user-logo-default.png";

import axios from "axios";
import { Link } from "react-router-dom";
import { ErrorContext } from "../context/ErrorContext";
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_WS;

const Header = () => {
  const { currentUser, setCurrentUser, logout } = useContext(AuthContext);
  const [searchUser, setSearchUser] = useState("");
  const [searchUserResults, setSearchUserResults] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isBurgerMenuHidden, setIsBurgerMenuHidden] = useState(true);
  const [isSearchBarHidden, setIsSearchBarHidden] = useState(true);
  const { setIsErrorExists, setErrorTxt } = useContext(ErrorContext);

  const handleClick = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setSearchUser(e.target.value);
  };

  const handleGetUsers = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/users/getUsers` + "?username=" + searchUser
      );
      setSearchUserResults(res.data);
    } catch (err) {
      console.log(err);
      setIsErrorExists(true);
      setErrorTxt(err.response.data);
    }
  };

  useEffect(() => {
    handleGetUsers();
    setIsBurgerMenuHidden(true);
  }, [searchUser]);

  window.addEventListener("resize", (e) => {
    setScreenWidth((prev) =>
      window.innerWidth > prev + 20 || window.innerWidth < prev - 20
        ? window.innerWidth
        : prev
    );
  });

  window.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    if (!isBurgerMenuHidden) {
      if (
        e.target.className === "header__burger_menu" ||
        e.target.className === "header__burger_menu_option" ||
        e.target.className === "header__burger_btn"
      )
        return;
      setIsBurgerMenuHidden(true);
    }
    if (
      e.target.className === "header__search_results" ||
      e.target.className === "header__search_result" ||
      e.target.tagName.toLowerCase() === "input"
    )
      return;
    setSearchUserResults([]);
  });

  useEffect(() => {
    console.log(screenWidth);
  }, [screenWidth]);
  return (
    <header className="header">
      <div className="header__container">
        <div
          className={
            screenWidth < 1020
              ? `header__burger_menu ${isBurgerMenuHidden ? "hidden" : ""}`
              : "header__menu"
          }
        >
          {currentUser && <button onClick={handleClick}>Logout</button>}
          {currentUser && <button onClick={handleClick}>Logout</button>}
          {currentUser && <button onClick={handleClick}>Logout</button>}
        </div>
        <div className="header__search">
          <input
            type="text"
            className={`header__search_input ${
              isSearchBarHidden ? "hidden" : ""
            }`}
            value={searchUser}
            onChange={handleChange}
          />
          <button
            className="header__search_btn"
            onClick={() => {
              setIsSearchBarHidden((prev) => {
                return !prev;
              });
            }}
          >
            <img src={searchIcon} alt="" />
          </button>
          {searchUserResults.length > 0 && (
            <ul className="header__search_results">
              {searchUserResults.map((user) => (
                <li className="header__search_result" key={user.id}>
                  <Link
                    to={"/user?username=" + user.username}
                    onClick={() => {
                      setSearchUser("");
                    }}
                  >
                    <img src={user?.icon || userDefaultIcon} alt="" />
                    <span>{user.username}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        {screenWidth < 1020 && (
          <div className="header__burger">
            <button
              className="header__burger_btn"
              onClick={() => {
                setIsBurgerMenuHidden((prev) => {
                  return !prev;
                });
              }}
            >
              <div></div>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
