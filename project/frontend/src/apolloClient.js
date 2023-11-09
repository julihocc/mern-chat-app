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

const authServiceLink = createUploadLink({
  uri: AUTH_SERVICE_HTTP_URL + "/graphql",
});

const authServiceWsLink = new WebSocketLink({
  uri: AUTH_SERVICE_WS_URL + "/graphql",
  options: {
    reconnect: true,
  },
});

const authMiddleware = setContext((_, { headers }) => {
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


const backendApolloClientLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    backendWsLink, // authMiddleware.concat(httpLink),
    authMiddleware.concat(backendLink), // Changed this line
)

export const backendApolloClient = new ApolloClient({
  link: backendApolloClientLink,
  cache: new InMemoryCache(),
});

const authServiceApolloClientLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    authServiceWsLink, // authMiddleware.concat(httpLink),
    authMiddleware.concat(authServiceLink), // Changed this line
)

export const authServiceApolloClient = new ApolloClient({
  link: authServiceApolloClientLink,
  cache: new InMemoryCache(),
});

