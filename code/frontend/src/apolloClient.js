import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import logger from "./utils/logger";

const GATEWAY_HTTP_URL = process.env.REACT_APP_GATEWAY_HTTP_URL || "http://localhost:3001";
const GATEWAY_WS_URL = process.env.REACT_APP_GATEWAY_WS_URL || "ws://localhost:3001";

logger.debug(`GATEWAY_SERVICE_HTTP_URL: ${GATEWAY_HTTP_URL}`);
logger.debug(`GATEWAY_SERVICE_WS_URL: ${GATEWAY_WS_URL}`);

const authMiddleware = setContext((_, { headers }) => {
	const tokenCookie = document.cookie
		.split("; ")
		.find((row) => row.startsWith("token="));
	const token = tokenCookie ? tokenCookie.split("=")[1] : "";

	return {
		headers: {
			...headers, authorization: token ? `Bearer ${token}` : "",
		},
	};
});

// const gatewayHttpLink = createUploadLink({
// 	uri: GATEWAY_HTTP_URL + "/graphql",
// });

const httpLink = new HttpLink({
	uri: GATEWAY_HTTP_URL + "/graphql",
});

// const wsClient = createClient({
// 	url: GATEWAY_WS_URL + "/graphql",
// 	reconnect: true,
// });

// const wsLink = new GraphQLWsLink(wsClient);

const wsLink = new GraphQLWsLink(createClient({
	url: GATEWAY_WS_URL + "/graphql",
	reconnect: true,
}));

// const gatewayApolloClientLink = split(
// 	({ query }) => {
// 		const definition = getMainDefinition(query);
// 		return (definition.kind === "OperationDefinition" && definition.operation === "subscription");
// 	},
// 	wsLink,
// 	authMiddleware.concat(gatewayHttpLink),
// );

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
//   wsLink,
  authMiddleware.concat(wsLink),
  authMiddleware.concat(httpLink)
);

// export const apolloClient = new ApolloClient({
// 	link: gatewayApolloClientLink,
// 	cache: new InMemoryCache(),
// });

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});