import React, { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import queries from "./queries";
import BinUnbin from "./BinUnbin";
import { onError } from "@apollo/client/link/error";

function Home() {
  const [posts, setPosts] = useState([]);
  const [pageNum, setpageNum] = useState(1);

  const { data, loading, error } = useQuery(
    queries.UNSPLASH_IMAGES,

    {
      fetchPolicy: "cache-and-network",
      variables: { pageNum },
    }
  );
  useEffect(() => {
    function fetchData() {
      if (data) {
        setPosts(posts.concat(data.unsplashImages));
      }
    }
    fetchData();
  }, [data]);
  function getMore() {
    setpageNum(pageNum + 1);
  }
  if (posts) {
    if (posts.length > 0) {
      return (
        <div>
          <br />
          <br />
          <div>
            {posts &&
              posts.map((element) => {
                return (
                  <div>
                    <BinUnbin
                      post={element}
                      key={element.id}
                      location=""
                    />
                  </div>
                );
              })}
            <button
              type="button"
              className="btn ok btn-lg btn-block"
              onClick={getMore}
            >
              GET MORE
            </button>
          </div>
        </div>
      );
    }
    else{
      <h1 className="col d-flex justify-content-center padding-xl .text-primary">
          NO POST FOUND
        </h1>
    }
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default Home;
