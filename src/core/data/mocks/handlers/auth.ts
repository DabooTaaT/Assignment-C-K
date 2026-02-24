import { graphql, HttpResponse } from "msw";

export const authHandlers = [
  graphql.mutation("Login", ({ variables }) => {
    const { email, password } = variables as { email: string; password: string };

    if (email === "test@example.com" && password === "password") {
      return HttpResponse.json({
        data: {
          login: {
            token: "mock-jwt-token",
            user: {
              id: "1",
              email: "test@example.com",
              name: "Test User",
            },
          },
        },
      });
    }

    return HttpResponse.json({
      errors: [{ message: "Invalid credentials" }],
    });
  }),

  graphql.query("Me", () => {
    return HttpResponse.json({
      data: {
        me: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
        },
      },
    });
  }),
];
