const { ApolloServer, gql } = require("apollo-server");

const redis = require("redis");
const axios = require("axios");
const client = redis.createClient();
const uuid = require("uuid");

async function main() {
  await client.connect();
  const typeDefs = gql`
    type Query {
      showPokemonList(pageNum: Int): pokemonList
      showPokemon(id: Int): pokemon
    }
    type pokemonList {
      count: Int
      results: [pokemon]
    }

    type pokemon {
      name: String!
      id: Int
      base_experience: Int
      height: Int
      url: String
      weight: Int
      image: String
      types: [types]
    }
    type types {
      slot: Int
      type: type
    }
    type type {
      name: String
    }
  `;
  const resolvers = {
    Query: {
      showPokemonList: async (_, args) => {
        if (!args.pageNum) {
          args.pageNum = 0;
        }
        const dataInRedis = await client.hGet(
          "pokemonList",
          args.pageNum.toString()
        );
        if (dataInRedis) {
          return JSON.parse(dataInRedis);
        } else {
          const { data: data } = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/?offset=${
              args.pageNum * 20
            }&limit=20`
          );
          console.log(data);
          data.results.map((element) => {
            id = element.url.split("/").at(-2);
            image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            element["id"] = id;
            element["image"] = image;
          });

          if (data.results.length == 0) {
            console.log(`No Pokemon`);
          } else {
            const pokemonListInRedis = {
              count: data.count,
              results: data.results,
              totalPages: Math.floor(data.count / 20),
            };

            await client.hSet(
              "pokemonList",
              args.pageNum,
              JSON.stringify(pokemonListInRedis)
            );
            return pokemonListInRedis;
          }
        }
      },
      showPokemon: async (_, args) => {
        if (!args.id) {
          args.id = 1;
        }
        const dataInRedis = await client.hGet(
          "pokemon",
          args.id.toString()
        );
        if (dataInRedis) {
          return JSON.parse(dataInRedis);
        }
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${args.id}/`
        );
        data.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${args.id}.png`;
        if (args.id === data.id) {
          const pokemonInRedis = await client.hSet(
            "pokemon",
            args.id,
            JSON.stringify(data)
          );
        }
        return data;
      },
    },
  };
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`  Server ready at ${url} `);
  });
}

main();
