// frontend\src\apolloClient.js
import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import logger from "./utils/logger";

const BACKEND_HTTP_URL = process.env.REACT_APP_BACKEND_HTTP_URL;
const BACKEND_WS_URL = process.env.REACT_APP_BACKEND_WS_URL;
logger.debug(`BACKEND_HTTP_URL: ${BACKEND_HTTP_URL}`);
logger.debug(`BACKEND_WS_URL: ${BACKEND_WS_URL}`);

const AUTH_SERVICE_HTTP_URL = process.env.REACT_APP_AUTH_SERVICE_HTTP_URL;
const AUTH_SERVICE_WS_URL = process.env.REACT_APP_AUTH_SERVICE_WS_URL;
logger.debug(`AUTH_SERVICE_HTTP_URL: ${AUTH_SERVICE_HTTP_URL}`);
logger.debug(`AUTH_SERVICE_WS_URL: ${AUTH_SERVICE_WS_URL}`);

const backendLink = createUploadLink({
  uri: BACKEND_HTTP_URL + "/graphql",
});

const backendWsLink = new WebSocketLink({
  uri: BACKEND_WS_URL + "/graphql",
  options: {
    reconnect: true,
  },
});

// Create an upload link for the authService server
const authServiceLink = createUploadLink({
  uri: AUTH_SERVICE_HTTP_URL + "/graphql",
});

// Create a WebSocket link for the authService server
const authServiceWsLink = new WebSocketLink({
  uri: AUTH_SERVICE_WS_URL + "/graphql",
  options: {
    reconnect: true,
  },
});

const tokenLink = setContext((_, { headers }) => {
  const tokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  const token = tokenCookie ? tokenCookie.split("=")[1] : "";

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  backendWsLink, // tokenLink.concat(httpLink),
  tokenLink.concat(backendLink), // Changed this line
);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default apolloClient;
