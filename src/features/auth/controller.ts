import { AuthState } from "./interface";

export const useAuth = (): AuthState => {
  const token = localStorage.getItem("auth_token");
  return {
    isAuthenticated: !!token,
    token,
  };
};
