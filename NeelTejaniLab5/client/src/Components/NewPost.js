import React, { useState } from "react";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import queries from "./queries";
import { useMutation } from "@apollo/client";

const NewPost = () => {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [post] = useMutation(queries.UPLOAD_IMAGE);

  async function creatingPost() {
    try {
      if (!url)
        throw new Error(
          "You have to enter URL to create a post"
        );
      const abc = await post({
        variables: {
          url: url,
          description: description,
          posterName: authorName,
        },
      });
      window.location.replace("/my-posts");
    } catch (e) {
      alert(e);
    }
  }
  return (
    <div className="col d-flex justify-content-center">
      <form>
        <div className="form-group">
          <label>URL</label>
          <input
            className="form-control"
            placeholder="ENTER IMAGE URL"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            className="form-control"
            placeholder="Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label>Author Name</label>
          <input
            className="form-control"
            placeholder="Author Name"
            onChange={(e) => {
              setAuthorName(e.target.value);
            }}
          />
        </div>

        <button className="btn ok" onClick={creatingPost}>
          Create A Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;
