import { ApolloLink } from "@apollo/client";

const TOKEN_KEY = "auth_token";

export const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(TOKEN_KEY);

  operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
