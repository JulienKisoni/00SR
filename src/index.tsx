import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#62449d",
    },
    secondary: {
      main: "#D5C7F9",
    },
    success: {
      main: "#029988",
    },
    error: {
      main: "#AB1819",
    },
  },
  typography: {
    h3: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    subtitle1: {
      lineHeight: 1.3,
      fontWeight: 400,
    },
    subtitle2: {
      color: "rgb(141, 139, 139)",
      fontWeight: 300,
    },
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
