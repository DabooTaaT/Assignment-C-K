import { server } from "@/core/data/mocks/server";
import { graphql, HttpResponse } from "msw";

describe("auth MSW handlers", () => {
  it("returns mock token for valid credentials", async () => {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }`,
        variables: { email: "test@example.com", password: "password" },
      }),
    });

    const json = await response.json();
    expect(json.data.login.token).toBe("mock-jwt-token");
  });

  it("allows overriding handlers per test", async () => {
    server.use(
      graphql.mutation("Login", () =>
        HttpResponse.json({ errors: [{ message: "Server error" }] })
      )
    );

    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token } }`,
        variables: { email: "test@example.com", password: "password" },
      }),
    });

    const json = await response.json();
    expect(json.errors[0].message).toBe("Server error");
  });
});
