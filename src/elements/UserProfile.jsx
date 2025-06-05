import React, { useEffect } from "react";
import userDefaultIcon from "../assets/user-logo-default.png";

const UserProfile = ({
  userData,
  isUserProfileHidden,
  setIsUserProfileHidden,
}) => {
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
      </div>
    </section>
  );
};

export default UserProfile;
