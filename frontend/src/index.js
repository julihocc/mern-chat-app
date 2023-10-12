// frontend/src/index.js
import "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { ApolloProvider } from "@apollo/client";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import apolloClient from "./apolloClient";
import theme from "./utils/theme";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";
import logger from "./utils/logger";
import React from "react";
import { Provider } from "react-redux";
import initializeStore from "./redux/store";

const root = document.getElementById("root");

initializeStore().then((store) => {
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ApolloProvider client={apolloClient}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
              <Provider store={store}>

                <App />

              </Provider>
            </ThemeProvider>
          </I18nextProvider>
        </ApolloProvider>
      </React.StrictMode>,
    );
  } else {

    logger.error("Error: Root element not found."); 
  }
});
