import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import theme from "./theme";
import { ToastContainer } from "react-toastify";
import { ConfirmProvider } from "material-ui-confirm";

import { Provider } from "react-redux";
import { store } from "./reduxStore/store";
import {BrowserRouter} from 'react-router-dom'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
   <BrowserRouter basename="/">
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConfirmProvider>
          <CssBaseline />
          <App />
          <ToastContainer
            position="bottom-left"
            theme="colored"
            autoClose={2000}
          />
        </ConfirmProvider>
      </ThemeProvider>
    </Provider>
   </BrowserRouter>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
