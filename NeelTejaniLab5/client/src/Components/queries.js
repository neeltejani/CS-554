import { gql } from "@apollo/client";

const UNSPLASH_IMAGES = gql`
  query ($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      binned
      posterName
      description
      userPosted
    }
  }
`;
const BINNED_IMAGES = gql`
  query binnedImages {
    binnedImages {
      id
      url
      binned
      posterName
      description
      userPosted
    }
  }
`;
const USERPOSTED_IMAGES = gql`
  query UserPostedImages {
    userPostedImages {
      binned
      description
      id
      posterName
      userPosted
      url
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation uploadImage(
    $url: String!
    $description: String
    $posterName: String
  ) {
    uploadImage(
      url: $url
      description: $description
      posterName: $posterName
    ) {
      url
      description
      posterName
      binned
      userPosted
      id
    }
  }
`;

const UPDATE_IMAGE = gql`
  mutation updateImage(
    $id: ID!
    $url: String
    $posterName: String
    $description: String
    $userPosted: Boolean
    $binned: Boolean
  ) {
    updateImage(
      id: $id
      url: $url
      posterName: $posterName
      description: $description
      userPosted: $userPosted
      binned: $binned
    ) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const DELETE_IMAGE = gql`
  mutation deleteImage($id: ID!) {
    deleteImage(id: $id) {
      url
      binned
      description
      id
      posterName
    }
  }
`;
export default {
  UNSPLASH_IMAGES,
  BINNED_IMAGES,
  USERPOSTED_IMAGES,
  UPLOAD_IMAGE,
  UPDATE_IMAGE,
  DELETE_IMAGE,
};
