import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { authLink } from "./links/authLink";
import { errorLink } from "./links/errorLink";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:4000/graphql",
});

export const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});
