import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import queries from "./Queries";
import { Link, useParams } from "react-router-dom";
import Trainer from "./Trainer";
import { useSelector, useDispatch } from "react-redux";
import actions from "../actions";
const Home = () => {
  const dispatch = useDispatch();
  var { pageNum } = useParams();
  const trainers = useSelector((state) => state.trainer);
  let selectedTrainer = trainers.filter(
    (trainer) => trainer.selected
  )[0];
  console.log("selected trainer is " + selectedTrainer);

  const { data, loading, error } = useQuery(
    queries.SHOW_POKEMON_LIST,
    {
      fetchPolicy: "cache-and-network",
      variables: { pageNum: parseInt(pageNum) },
    }
  );

  async function handleCatchButton(e, pokemon) {
    e.preventDefault();
    if (selectedTrainer.pokemon.length < 6) {
      dispatch(actions.catchPokemon(pokemon));
    } else {
      alert("You already have 6 pokemon!");
    }
  }
  async function handleReleaseButton(e, pokemon) {
    e.preventDefault();
    dispatch(actions.releasePokemon(pokemon));
  }

  function loadButtons() {
    if (parseInt(pageNum) === 0) {
      return (
        <div className=" text-center">
          <Link
            className="navlink btn ok btn-lg"
            to={`/pokemon/page/${parseInt(pageNum) + 1}`}
          >
            Next
          </Link>
        </div>
      );
    } else if (
      parseInt(pageNum) ===
      Math.floor(data.showPokemonList.count / 20)
    ) {
      return (
        <div className=" text-center">
          <Link
            className="navlink btn ok btn-lg"
            to={`/pokemon/page/${parseInt(pageNum) - 1}`}
          >
            Previous
          </Link>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <Link
            className="navlink btn ok btn-lg"
            to={`/pokemon/page/${parseInt(pageNum) - 1}`}
          >
            Previous
          </Link>
          <Link
            className="navlink btn ok btn-lg"
            to={`/pokemon/page/${parseInt(pageNum) + 1}`}
          >
            Next
          </Link>
        </div>
      );
    }
  }
  console.log("selectedTrainer us " + selectedTrainer);

  if (data) {
    console.log(trainers);
    return (
      <div className="container">
        <br />
        {loadButtons()}
        <br />
        <div className="row">
          {data.showPokemonList.results.map((pokemon) => {
            return (
              <div className="col" key={pokemon.id}>
                <div className="card text-center">
                  {
                    <h1 className="col d-flex justify-content-center text-capitalize font-weight-light">
                      {pokemon.name}
                    </h1>
                  }
                  {pokemon.image ? (
                    <Link to={`/pokemon/${pokemon.id}`}>
                      <img
                        className="card-img-top"
                        src={pokemon.image}
                        alt="Card image cap"
                      />
                    </Link>
                  ) : (
                    <a href="https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg">
                      <img
                        className="card-img-top"
                        src="https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
                        alt="Card"
                      />
                    </a>
                  )}

                  {selectedTrainer ? (
                    <div>
                      {" "}
                      {selectedTrainer &&
                      selectedTrainer.pokemon.filter(
                        (poke) => poke.id === pokemon.id
                      ).length > 0 ? (
                        <button
                          className="btn btn-danger navlink"
                          onClick={(e) =>
                            handleReleaseButton(e, pokemon)
                          }
                        >
                          Release
                        </button>
                      ) : (
                        <button
                          className="btn btn-success navlink"
                          onClick={(e) =>
                            handleCatchButton(e, pokemon)
                          }
                        >
                          Catch
                        </button>
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
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
};

export default Home;
