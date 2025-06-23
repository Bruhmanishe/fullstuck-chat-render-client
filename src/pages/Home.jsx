import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Post from "../elements/Post";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser]);
  return (
    <main>
      <Post />
    </main>
  );
};

export default Home;
