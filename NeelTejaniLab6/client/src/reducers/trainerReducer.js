import { v4 as uuid } from "uuid";
const initialState = [
  {
    trainerId: uuid(),
    trainerName: "Neel",
    selected: false,
    pokemon: [],
  },
];

let copyState = null;
let index = null;
const trainerReducer = (state = initialState, action) => {
  const { type, payload } = action;
  let indexForSelect = state.findIndex(
    (e) => e.selected === true
  );
  switch (type) {
    case "ADD_TRAINER":
      return [
        ...state,
        {
          trainerId: uuid(),
          trainerName: payload.trainerName,
          selected: false,
          pokemon: [],
        },
      ];
    case "DELETE_TRAINER":
      copyState = [...state];
      index = copyState.findIndex(
        (e) => e.trainerId === payload.trainerId
      );
      copyState.splice(index, 1);
      return [...copyState];
    case "SELECT_TRAINER":
      copyState = [...state];
      index = copyState.findIndex(
        (e) => e.trainerId === payload.trainerId
      );
      console.log("index is " + index); //1
      if (indexForSelect === index) {
        copyState[indexForSelect].selected =
          !copyState[indexForSelect].selected;
        return [...copyState];
      }
      if (indexForSelect === -1) {
        copyState[index].selected = true;
        return [...copyState];
      } else {
        copyState[indexForSelect].selected =
          !copyState[indexForSelect].selected;
        copyState[index].selected =
          !copyState[index].selected;
        return [...copyState];
      }
    case "CATCH_POKEMON":
      copyState = [...state];
      index = copyState.findIndex(
        (e) => e.selected === true
      );
      if (index === -1) {
        return [...copyState];
      } else {
        copyState[index].pokemon.push(payload.pokemon);
        return [...copyState];
      }
    case "RELEASE_POKEMON":
      let selectedTrainer = state.filter(
        (trainer) => trainer.selected
      );
      if (
        selectedTrainer == null ||
        selectedTrainer.length == 0
      ) {
        return [...state];
      }
      copyState = [...state];
      return [
        ...copyState.map((x) => {
          if (x.trainerId == selectedTrainer[0].trainerId) {
            let pokemonInx = x.pokemon.findIndex(
              (p) => p.id == payload.pokemon.id
            );
            x.pokemon.splice(pokemonInx, 1);
          }
          return x;
        }),
      ];

    default:
      return state;
  }
};
export default trainerReducer;
