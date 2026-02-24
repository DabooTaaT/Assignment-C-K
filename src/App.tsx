import { RouterProvider } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/core/network";
import { router } from "@/core/router";
import "@/core/i18n";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}

export default App;
