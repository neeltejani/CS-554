import { gql } from "@apollo/client";

const SHOW_POKEMON_LIST = gql`
  query showPokemonList($pageNum: Int) {
    showPokemonList(pageNum: $pageNum) {
      count
      results {
        id
        image
        name
        url
      }
    }
  }
`;
const SHOW_POKEMON = gql`
  query showPokemon($id: Int) {
    showPokemon(id: $id) {
      id
      base_experience
      height
      image
      name
      url
      weight
      types {
        slot
        type {
          name
        }
      }
    }
  }
`;
export default { SHOW_POKEMON, SHOW_POKEMON_LIST };
