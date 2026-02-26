import { gql } from "@apollo/client";

export const GET_HOME_PAGE_DATA = gql`
  query GetHomePageData {
    products {
      id
      name
      detail
      imageUrl
    }
    services {
      id
      name
      detail
      imageUrl
    }
  }
`;
