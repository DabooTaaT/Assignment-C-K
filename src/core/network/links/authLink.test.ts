import { setAuthToken, clearAuthToken } from "@/core/network/links/authLink";

describe("authLink helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("setAuthToken stores token in localStorage", () => {
    setAuthToken("abc123");
    expect(localStorage.getItem("auth_token")).toBe("abc123");
  });

  it("clearAuthToken removes token from localStorage", () => {
    localStorage.setItem("auth_token", "abc123");
    clearAuthToken();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});
