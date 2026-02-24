export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export const useAuth = (): AuthState => {
  const token = localStorage.getItem("auth_token");
  return {
    isAuthenticated: !!token,
    token,
  };
};
