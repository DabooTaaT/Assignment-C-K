import { onError } from "@apollo/client/link/error";
import { clearAuthToken } from "./authLink";

type MaybeApolloError = {
  message?: string;
  statusCode?: number;
  errors?: Array<{
    message?: string;
    extensions?: {
      code?: string;
    };
  }>;
};

export const errorLink = onError(({ error, operation }) => {
  const apolloError = error as MaybeApolloError | undefined;
  const graphQLErrors = apolloError?.errors ?? [];
  const isUnauthorized =
    apolloError?.statusCode === 401 ||
    graphQLErrors.some((gqlError) => gqlError.extensions?.code === "UNAUTHENTICATED");

  graphQLErrors.forEach((gqlError) => {
    console.error(
      `[GraphQL error] Operation: ${operation.operationName} - ${gqlError.message ?? "Unknown error"}`
    );
  });

  if (isUnauthorized) {
    clearAuthToken();
    window.location.href = "/login";
  }

  if (apolloError?.message) {
    console.error(`[Network error] ${apolloError.message}`);
  }
});
