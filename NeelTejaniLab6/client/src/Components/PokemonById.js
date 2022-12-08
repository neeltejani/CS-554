import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import queries from "./Queries";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import actions from "../actions";

console.log("entered Pokemon by id");
function Home() {
  const dispatch = useDispatch();

  var { id } = useParams();
  const trainers = useSelector((state) => state.trainer);
  let selectedTrainer = trainers.filter(
    (trainer) => trainer.selected
  )[0];
  async function handleCatchButton(e, pokemon) {
    e.preventDefault();
    dispatch(actions.catchPokemon(pokemon));
  }
  async function handleReleaseButton(e, pokemon) {
    e.preventDefault();
    dispatch(actions.releasePokemon(pokemon));
  }

  const { data, loading, error } = useQuery(
    queries.SHOW_POKEMON,
    {
      fetchPolicy: "cache-and-network",
      variables: { id: parseInt(id) },
    }
  );
  console.log(data);
  if (data) {
    return (
      <div
        className="card-columns-center "
        key={data.showPokemon.id}
      >
        <div className="card1">
          {
            <h1 className="col d-flex justify-content-center text-capitalize font-weight-light">
              {data.showPokemon.name}
            </h1>
          }

          <a href={data.showPokemon.image}>
            <img
              className="card-img-top"
              src={data.showPokemon.image}
              alt="Card image cap"
            />
          </a>

          {selectedTrainer &&
            (selectedTrainer.pokemon.filter(
              (pokemon) =>
                pokemon.id === data.showPokemon.id
            ).length > 0 ? (
              <button
                className=" btn btn-danger navlink"
                onClick={(e) =>
                  handleReleaseButton(e, data.showPokemon)
                }
              >
                Release
              </button>
            ) : (
              <button
                className="btn btn-success navlink"
                onClick={(e) =>
                  handleCatchButton(e, data.showPokemon)
                }
              >
                Catch
              </button>
            ))}
        </div>
        <div className="card2">
          <h2>Types :</h2>
          {data.showPokemon.types.map((type) => {
            console.log(type);
            return (
              <h2 className="col d-flex justify-content-center text-capitalize font-weight-light">
                {type.type.name}
              </h2>
            );
          })}
        </div>
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default Home;
