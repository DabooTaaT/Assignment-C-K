// src/App.tsx
import { RouterProvider } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { apolloClient } from "@/core/network";
import { router } from "@/core/router";
import { muiTheme } from "@/core/theme";
import "@/core/i18n";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
