// frontend/src/index.js
import "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { ApolloProvider } from "@apollo/client";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import apolloClient from "./apolloClient";
import theme from "./utils/theme"; // Import your custom MUI theme file
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";
import logger from "./utils/logger"; // I've imported the logger here
import React from "react"; // Import React to use React.StrictMode
import { Provider } from "react-redux";
// import AuthProvider from "./AuthProvider";
import initializeStore from "./redux/store";

const root = document.getElementById("root");

initializeStore().then((store) => {
  if (root) {
    ReactDOM.createRoot(root).render(
      // I've added React.StrictMode here
      <React.StrictMode>
        <ApolloProvider client={apolloClient}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
              <Provider store={store}>
                {/* <AuthProvider> */}
                <App />
                {/* </AuthProvider> */}
              </Provider>
            </ThemeProvider>
          </I18nextProvider>
        </ApolloProvider>
      </React.StrictMode>,
    );
  } else {
    // Instead of using console.error, I've used our custom logger to handle the error message
    // console.error('Error: Root element not found.'); // I've commented out the old console.error statement
    logger.error("Error: Root element not found."); // Here's where I replaced console.error with logger.error
  }
});
