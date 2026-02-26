import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      description
      imageUrl
    }
  }
`;

export const GET_SERVICES = gql`
  query GetServices {
    services {
      id
      title
      description
      imageUrl
    }
  }
`;
