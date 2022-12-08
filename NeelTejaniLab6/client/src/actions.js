const addTrainer = (name) => ({
  type: "ADD_TRAINER",
  payload: {
    trainerName: name,
  },
});
const deleteTrainer = (id) => ({
  type: "DELETE_TRAINER",
  payload: {
    trainerId: id,
  },
});

const selectTrainer = (id) => ({
  type: "SELECT_TRAINER",
  payload: {
    trainerId: id,
  },
});
const catchPokemon = (pokemon) => ({
  type: "CATCH_POKEMON",
  payload: {
    pokemon: pokemon,
  },
});

const releasePokemon = (pokemon) => ({
  type: "RELEASE_POKEMON",
  payload: {
    pokemon: pokemon,
  },
});
const searchPokemon = (name) => ({
  type: "SEARCH_POKEMON",
  payload: {
    pokemonName: name,
  },
});
module.exports = {
  addTrainer,
  deleteTrainer,
  selectTrainer,
  catchPokemon,
  releasePokemon,
  searchPokemon,
};
