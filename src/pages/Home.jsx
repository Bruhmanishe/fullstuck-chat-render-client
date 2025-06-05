import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser]);
  return <main>Home</main>;
};

export default Home;
