const { ApolloServer, gql } = require("apollo-server");
const redis = require("redis");
const axios = require("axios");
const client = redis.createClient();
const uuid = require("uuid");
`client_id neel = 9s_jR1a_AHClB88XJB9-Ol3k4ETjysXJsMwP3ZMg6G8`;
async function main() {
  await client.connect();
  const typeDefs = gql`
    type Query {
      unsplashImages(pageNum: Int): [ImagePost]
      binnedImages: [ImagePost]
      userPostedImages: [ImagePost]
    }
    type ImagePost {
      id: ID!
      url: String!
      posterName: String!
      description: String
      userPosted: Boolean!
      binned: Boolean!
    }
    type Mutation {
      uploadImage(
        url: String!
        description: String
        posterName: String
      ): ImagePost
      updateImage(
        id: ID!
        url: String
        posterName: String
        description: String
        userPosted: Boolean
        binned: Boolean
      ): ImagePost
      deleteImage(id: ID!): ImagePost
    }
  `;
  const resolvers = {
    Query: {
      unsplashImages: async (_, args) => {
        if (!args.pageNum) {
          args.pageNum = 1;
        }
        const { data } = await axios.get(
          `https://api.unsplash.com/photos?page=${args.pageNum}&client_id=9s_jR1a_AHClB88XJB9-Ol3k4ETjysXJsMwP3ZMg6G8`
        );
        const imagesforPage = [];

        console.log(data);
        for (let i = 0; i < data.length; i++) {
          const redisD = await client.hGet(
            "imagePosts",
            data[i].id
          );
          if (redisD == null) {
            const image = {
              id: data[i].id,
              url: data[i].urls.raw,
              posterName: data[i].user.name,
              description: data[i].description,
              userPosted: false,
              binned: false,
            };
            imagesforPage.push(image);
          } else {
            imagesforPage.push(JSON.parse(redisD));
          }
        }
        return imagesforPage;
      },
      binnedImages: async (_, args) => {
        try {
          console.log("entered binned images");
          const imagePostsinredis = await client.HGETALL(
            "imagePosts"
          );
          if (imagePostsinredis) {
            const imagePost = JSON.parse(
              JSON.stringify(imagePostsinredis)
            );
            var imagePosts = new Array();
            for (var key in imagePost) {
              if (imagePost.hasOwnProperty(key)) {
                if (JSON.parse(imagePost[key]).binned) {
                  imagePosts.push(
                    JSON.parse(imagePost[key])
                  );
                }
              }
            }
            return imagePosts;
          }
        } catch (e) {
          console.log(e.message);
        }
      },
      userPostedImages: async (_, args) => {
        try {
          console.log("entered userPosted images");
          const imagePostsinredis = await client.HGETALL(
            "imagePosts"
          );
          if (imagePostsinredis) {
            const imagePost = JSON.parse(
              JSON.stringify(imagePostsinredis)
            );
            var imagePosts = new Array();
            for (var key in imagePost) {
              if (imagePost.hasOwnProperty(key)) {
                if (JSON.parse(imagePost[key]).userPosted) {
                  imagePosts.push(
                    JSON.parse(imagePost[key])
                  );
                }
              }
            }
            return imagePosts;
          }
        } catch (e) {
          console.log(e.message);
        }
      },
    },
    Mutation: {
      uploadImage: async (_, args) => {
        console.log("entered mutation uploadImage");
        try {
          const uploadingImage = {
            url: args.url,
            description: args.description,
            posterName: args.posterName,
            binned: false,
            userPosted: true,
            id: uuid.v4(),
          };
          if (
            (await client.hSet(
              "imagePosts",
              uploadingImage.id,
              JSON.stringify(uploadingImage)
            )) == 0
          )
            throw new Error(`Data can not set in redis`);
          return uploadingImage;
        } catch (e) {
          console.log(e.message);
        }
      },
      updateImage: async (_, args) => {
        const newImage = {
          url: args.url,
          description: args.description,
          posterName: args.posterName,
          binned: args.binned,
          userPosted: args.userPosted,
          id: args.id,
        };
        const imagePostinredis = await client.hGet(
          "imagePosts",
          newImage.id
        );
        if (imagePostinredis != null) {
          const imagePost = JSON.parse(imagePostinredis);
          if (
            imagePost.binned == true &&
            imagePost.userPosted == false
          ) {
            await client.hDel("imagePosts", newImage.id);
            return imagePost;
          }
          if (
            imagePost.userPosted == true &&
            imagePost.binned == false
          ) {
            const newImageforBin = {
              url: args.url,
              description: args.description,
              posterName: args.posterName,
              binned: true,
              userPosted: args.userPosted,
              id: args.id,
            };
            await client.hDel("imagePosts", newImage.id);
            await client.hSet(
              "imagePosts",
              newImageforBin.id,
              JSON.stringify(newImageforBin)
            );
            return newImageforBin;
          }
          if (
            imagePost.userPosted == true &&
            imagePost.binned == true
          ) {
            const newImageforBin = {
              url: args.url,
              description: args.description,
              posterName: args.posterName,
              binned: false,
              userPosted: args.userPosted,
              id: args.id,
            };
            await client.hDel(
              "imagePosts",
              newImageforBin.id
            );
            await client.hSet(
              "imagePosts",
              newImageforBin.id,
              JSON.stringify(newImageforBin)
            );
            return newImageforBin;
          }
          if (
            imagePost.userPosted == false &&
            imagePost.binned == false
          ) {
            const newImageforBin = {
              url: args.url,
              description: args.description,
              posterName: args.posterName,
              binned: true,
              userPosted: args.userPosted,
              id: args.id,
            };
            await client.hSet(
              "imagePosts",
              newImageforBin.id,
              JSON.stringify(newImageforBin)
            );
            return newImageforBin;
          }
        } else {
          const newImageforBin = {
            url: args.url,
            description: args.description,
            posterName: args.posterName,
            binned: true,
            userPosted: args.userPosted,
            id: args.id,
          };
          if (
            (await client.hSet(
              "imagePosts",
              newImageforBin.id,
              JSON.stringify(newImageforBin)
            )) == 0
          )
            return newImageforBin;
        }
      },
      deleteImage: async (_, args) => {
        console.log("entered mutation deleteImage");
        try {
          const image = await client.hGet(
            "imagePosts",
            args.id
          );
          console.log(image);
          if (image != null) {
            const imagePost = JSON.parse(image);
            if (args.id == imagePost.id) {
              if (
                (await client.hDel(
                  "imagePosts",
                  imagePost.id
                )) == 0
              ) {
                throw new Error(
                  "Failed to delete post from redis"
                );
              }
            }
            return imagePost;
          } else {
            throw new Error("Post can not be deleted");
          }
        } catch (e) {
          console.log(e.message);
        }
      },
    },
  };
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(
      `:rocket:  Server ready at ${url} :rocket:`
    );
  });
}
main();
