import axios from "axios";
import React from "react";
import { useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_WS;

const Post = () => {
  const [post, setPost] = useState({
    html: "<p><span style=`color: red`>Post</span>This is</p>",
    title: "Title",
    username: "User",
    userIcon: null,
    likes: 10,
  });

  const [icon, setIcon] = useState(null);
  // const handleChange = (e) => {
  //   setText(e.target.value);
  // };s
  // const handleCrateBreak = (e) => {
  //   console.log(e.key);
  //   if (e.key === "Enter") {
  //     setText((prev) => prev + "<p>");
  //   }
  // };

  const handleClick = async (e) => {
    try {
      const res = await axios.post(backendUrl + "/api/upload/uploadIcon", {
        icon,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="post">
      <div className="post__user">
        <div className="post__user-data"></div>
        <div className="post__user-controls"></div>
      </div>
      <h2 className="post__title">{post.title}</h2>
      <div className="post__content-container">
        <div
          className="post__content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        <div className="post__likes"></div>
      </div>
      <input
        type="file"
        max={1}
        onChange={(e) => {
          setIcon(e.target.files[0]);
        }}
      />
      <button onClick={handleClick}></button>
    </section>
  );
};

export default Post;
