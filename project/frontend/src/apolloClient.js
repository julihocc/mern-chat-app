// frontend\src\apolloClient.js
import {ApolloClient, InMemoryCache, split} from "@apollo/client";
import {WebSocketLink} from "@apollo/client/link/ws";
import {getMainDefinition} from "@apollo/client/utilities";
import {setContext} from "@apollo/client/link/context";
import {createUploadLink} from "apollo-upload-client";
import logger from "./utils/logger";

const GATEWAY_HTTP_URL = process.env.REACT_APP_GATEWAY_HTTP_URL
const GATEWAY_WS_URL = process.env.REACT_APP_GATEWAY_WS_URL
logger.debug(`GATEWAY_SERVICE_HTTP_URL: ${GATEWAY_HTTP_URL}`)
logger.debug(`GATEWAY_SERVICE_WS_URL: ${GATEWAY_WS_URL}`)

const authMiddleware = setContext((_, {headers}) => {
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

const gatewayHttpLink = createUploadLink({
	uri: GATEWAY_HTTP_URL + "/graphql",
});

const gatewayWsLink = new WebSocketLink({
	uri: GATEWAY_WS_URL + "/graphql", options: {
		reconnect: true,
	},
});

const gatewayApolloClientLink = split(({query}) => {
		const definition = getMainDefinition(query);
		return (definition.kind === "OperationDefinition" && definition.operation === "subscription");
	}, gatewayWsLink,
	authMiddleware.concat(gatewayHttpLink),
)

export const apolloClient = new ApolloClient({
	link: gatewayApolloClientLink, cache: new InMemoryCache(),
});

