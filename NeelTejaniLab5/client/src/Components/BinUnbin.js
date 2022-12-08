import React, { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import queries from "./queries";
const BinUnbin = ({ post: newPost, location }) => {
  const [post, setPost] = useState(newPost);
  const [updateImage] = useMutation(queries.UPDATE_IMAGE);
  const [deleteImage] = useMutation(queries.DELETE_IMAGE);
  function loadButtons() {
    console.log(post.binned);
    try {
      if (location == "") {
        if (post.binned == false) {
          return (
            <div>
              <button
                type="button"
                className="btn ok btn-lg btn-block"
                onClick={Binning}
              >
                ADD TO BIN
              </button>
            </div>
          );
        } else {
          return (
            <div>
              <button
                type="button"
                className="btn ok btn-lg btn-block"
                onClick={UnBinning}
              >
                REMOVE FROM BIN
              </button>
            </div>
          );
        }
      } else if (location == "my-bin") {
        return (
          <div>
            <button
              type="button"
              className="btn ok btn-lg btn-block"
              onClick={UnBinning}
            >
              REMOVE FROM MY BIN
            </button>
          </div>
        );
      } else {
        if (post.binned == false) {
          return (
            <div>
              <button
                type="button"
                className="btn ok btn-lg btn-block"
                onClick={Binning}
              >
                ADD TO BIN
              </button>
              <button
                type="button"
                className="btn ok btn-lg
                btn-block"
                onClick={deleting}
              >
                DELETE POST
              </button>
            </div>
          );
        } else {
          return (
            <div>
              <button
                type="button"
                className="btn ok btn-lg btn-block"
                onClick={UnBinning}
              >
                REMOVE FROM BIN
              </button>
              <button
                type="button"
                className="btn ok btn-lg
                btn-block"
                onClick={deleting}
              >
                DELETE POST
              </button>
            </div>
          );
        }
      }
    } catch (e) {
      alert(e);
    }
  }
  async function deleting() {
    try {
      await deleteImage({
        variables: {
          id: post.id,
        },
      });
      window.location.reload(false);
    } catch (e) {
      alert(e);
    }
  }
  async function Binning() {
    console.log(`entered binning`);
    try {
      const { data } = await updateImage({
        variables: {
          id: post.id,
          url: post.url,
          posterName: post.posterName,
          description: post.description,
          userPosted: post.userPosted,
          binned: true,
        },
      });
      window.location.reload(false);
      setPost(data.updateImage);
    } catch (e) {
      alert(e);
    }
  }
  async function UnBinning() {
    try {
      const { data } = await updateImage({
        variables: {
          url: post.url,
          description: post.description,
          posterName: post.posterName,
          id: post.id,
          userPosted: post.userPosted,
          binned: false,
        },
      });
      window.location.reload(false);

      setPost(data.updateImage);
    } catch (e) {
      alert(e);
    }
  }

  if (post) {
    return (
      <div className="card-columns-center" key={post.id}>
        <div className="card">
          {post.posterName ? (
            <h1 className="col d-flex justify-content-center">
              {post.posterName}
            </h1>
          ) : (
            <h2 className="col d-flex justify-content-center">
              No PosterName
            </h2>
          )}
          {post.description ? (
            <h1 className="col d-flex justify-content-center">
              {post.description}
            </h1>
          ) : (
            <h2 className="col d-flex justify-content-center">
              No Description
            </h2>
          )}
          {post.url ? (
            <a href={post.url}>
              <img
                className="card-img-top"
                src={post.url}
                alt="Card image cap"
              />
            </a>
          ) : (
            <a href="https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg">
              <img
                className="card-img-top"
                src="https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
                alt="Card image cap"
              />
            </a>
          )}

          {loadButtons()}
        </div>
      </div>
    );
  }
};
export default BinUnbin;
