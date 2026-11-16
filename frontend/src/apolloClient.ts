import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import logger from "./utils/logger";

const GATEWAY_HTTP_URL = import.meta.env.VITE_GATEWAY_HTTP_URL || "http://localhost:3001";
const GATEWAY_WS_URL = import.meta.env.VITE_GATEWAY_WS_URL || "ws://localhost:3001";

logger.debug(`GATEWAY_SERVICE_HTTP_URL: ${GATEWAY_HTTP_URL}`);
logger.debug(`GATEWAY_SERVICE_WS_URL: ${GATEWAY_WS_URL}`);

const httpLink = new HttpLink({
	uri: GATEWAY_HTTP_URL + "/graphql",
	credentials: "include",
});

const wsLink = new GraphQLWsLink(createClient({
	url: GATEWAY_WS_URL + "/graphql",
	connectionParams: () => ({}),
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
