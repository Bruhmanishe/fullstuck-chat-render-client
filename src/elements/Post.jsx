import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
const backendUrl = import.meta.env.VITE_BACKEND_HTTP;
const backendUrlWS = import.meta.env.VITE_BACKEND_WS;

const Post = () => {
  const { currentUser } = useContext(AuthContext);
  const [post, setPost] = useState("");

  const handlePublish = async () => {
    try {
      const res = axios.post(backendUrl + "/posts/createPost", {});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(post);
  }, [post]);

  return (
    <section className="post">
      <ReactQuill
        modules={{
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              ["link", "video"],
              ["clean"],
            ],
          },
        }}
        value={post}
        onChange={setPost}
      />
      <button className="post__publish-btn">Publish</button>
    </section>
  );
};

export default Post;
