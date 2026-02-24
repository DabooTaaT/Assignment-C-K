import { onError } from "@apollo/client/link/error";
import { clearAuthToken } from "./authLink";

export const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      console.error(`[GraphQL error] Operation: ${operation.operationName} - ${message}`);

      if (
        extensions?.code === "UNAUTHENTICATED" ||
        (networkError && "statusCode" in networkError && networkError.statusCode === 401)
      ) {
        clearAuthToken();
        window.location.href = "/login";
      }
    });
  }

  if (networkError) {
    console.error(`[Network error] ${networkError.message}`);
  }
});
