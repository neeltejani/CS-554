import React from "react";
import "./App.css";
import { useQuery } from "@apollo/client";
import queries from "./queries";
import BinUnbin from "./BinUnbin";
function MyPosts() {
  console.log("entered My Posts");
  const { data, loading, error } = useQuery(
    queries.USERPOSTED_IMAGES,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  if (data) {
    if (data.userPostedImages.length > 0) {
      return (
        <div>
          <br />
          <br />
          <div>
            {data.userPostedImages &&
              data.userPostedImages.map((element) => {
                return (
                  <div>
                    <BinUnbin
                      post={element}
                      key={element.id}
                      location="my-posts"
                    />
                  </div>
                );
              })}
          </div>
        </div>
      );
    } else {
      return (
        <h1 className="col d-flex justify-content-center padding-xl">
          YOU HAVEN'T POSTED ANYTHING YET
        </h1>
      );
    }
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}
export default MyPosts;
