import React from "react";
import "./App.css";
import { useQuery } from "@apollo/client";
import queries from "./queries";
import BinUnbin from "./BinUnbin";
function MyBin(props) {
  const { data, loading, error } = useQuery(
    queries.BINNED_IMAGES,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  if (data) {
    if (data.binnedImages.length > 0) {
      return (
        <div>
          <br />
          <br />
          <div>
            {data.binnedImages &&
              data.binnedImages.map((element) => {
                return (
                  <div>
                    <BinUnbin
                      post={element}
                      key={element.id}
                      location="my-bin"
                    />
                  </div>
                );
              })}
          </div>
        </div>
      );
    } else {
      return (
        <h1 className="col d-flex justify-content-center padding-xl .text-primary">
          YOU HAVEN"T BINNED ANY IMAGE
        </h1>
      );
    }
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}
export default MyBin;
