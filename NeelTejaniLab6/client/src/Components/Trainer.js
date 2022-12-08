import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../actions";
import { Link } from "react-router-dom";
export default function Trainer() {
  const dispatch = useDispatch();
  const [addTrainerButton, setAddTrainerButton] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [trainerName, setTrainerName] = useState("");
  const trainers = useSelector((state) => state.trainer);
  console.log(trainers);
  const handleSelectButton = (e, id) => {
    e.preventDefault();
    dispatch(actions.selectTrainer(id));
  };
  const handleAddTrainer = (e) => {
    if (document.getElementById("reseting").value) {
      e.preventDefault();
      document.getElementById("reseting").value = "";
      dispatch(actions.addTrainer(trainerName));
    } else {
      e.preventDefault();
      alert("Please enter a name");
    }
  };
  const handleDeleteTrainer = (e, id) => {
    e.preventDefault();
    dispatch(actions.deleteTrainer(id));
  };

  let selectedTrainer = trainers.filter(
    (trainer) => trainer.selected
  )[0];
  console.log("selected trainer is " + selectedTrainer);

  console.log(trainers);
  return (
    <div className="col text-center">
      <br />
      <button
        className="navlink"
        onClick={() =>
          setAddTrainerButton(!addTrainerButton)
        }
      >
        Add A Trainer
      </button>
      <br />
      <br />
      {addTrainerButton && (
        <form>
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="reseting">
                Enter Name of Trainer
              </label>
              <input
                id="reseting"
                className="form-control"
                defaultValue=""
                onChange={(e) => {
                  setTrainerName(e.target.value);
                }}
              />
            </div>
            <button
              type="submit"
              className="navlink"
              onClick={(e) => handleAddTrainer(e)}
            >
              Create Trainer
            </button>
          </div>
        </form>
      )}
      {trainers.length > 0 &&
        trainers.map((trainer) => (
          <div key={trainer.id}>
            <div
              className="col text-center"
              key={trainer.id}
            >
              <h1>Trainer : {trainer.trainerName}</h1>
              <br />

              <div key={trainer.trainerId}>
                {trainer.selected && (
                  <button
                    className="navlink"
                    onClick={(e) =>
                      handleSelectButton(
                        e,
                        trainer.trainerId
                      )
                    }
                  >
                    Selected
                  </button>
                )}
                {!trainer.selected && (
                  <button
                    className="navlink"
                    onClick={(e) =>
                      handleSelectButton(
                        e,
                        trainer.trainerId
                      )
                    }
                  >
                    Select
                  </button>
                )}
              </div>
              <br />
              {!trainer.selected && (
                <div>
                  <button
                    className="navlink"
                    onClick={(e) =>
                      handleDeleteTrainer(
                        e,
                        trainer.trainerId
                      )
                    }
                  >
                    Delete Trainer
                  </button>
                </div>
              )}

              <br />
            </div>
            {trainer.pokemon.length > 0 && (
              <div id="trainer.id">
                <h1>
                  {trainer.trainerName}'s Pokemon List
                </h1>
                <div className="row">
                  {trainer.pokemon.map((pokemon) => {
                    return (
                      <div className="col" key={pokemon.id}>
                        <div className="card">
                          {
                            <h1 className="col d-flex justify-content-center text-capitalize font-weight-light">
                              {pokemon.name}
                            </h1>
                          }
                          {pokemon.image ? (
                            <Link
                              to={`/pokemon/${pokemon.id}`}
                            >
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
