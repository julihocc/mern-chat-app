// frontend\src\apolloClient.js
import {ApolloClient, InMemoryCache, split} from "@apollo/client";
import {WebSocketLink} from "@apollo/client/link/ws";
import {getMainDefinition} from "@apollo/client/utilities";
import {setContext} from "@apollo/client/link/context";
import {createUploadLink} from "apollo-upload-client";
import logger from "./utils/logger";

const CONTACT_SERVICE_HTTP_URL = process.env.REACT_APP_CONTACT_SERVICE_HTTP_URL;
const CONTACT_SERVICE_WS_URL = process.env.REACT_APP_CONTACT_SERVICE_WS_URL;
logger.debug(`CONTACT_SERVICE_HTTP_URL: ${CONTACT_SERVICE_HTTP_URL}`);
logger.debug(`CONTACT_SERVICE_WS_URL: ${CONTACT_SERVICE_WS_URL}`);

const AUTH_SERVICE_HTTP_URL = process.env.REACT_APP_AUTH_SERVICE_HTTP_URL;
const AUTH_SERVICE_WS_URL = process.env.REACT_APP_AUTH_SERVICE_WS_URL;
logger.debug(`AUTH_SERVICE_HTTP_URL: ${AUTH_SERVICE_HTTP_URL}`);
logger.debug(`AUTH_SERVICE_WS_URL: ${AUTH_SERVICE_WS_URL}`);

const CHAT_SERVICE_HTTP_URL = process.env.REACT_APP_CHAT_SERVICE_HTTP_URL;
const CHAT_SERVICE_WS_URL = process.env.REACT_APP_CHAT_SERVICE_WS_URL;
logger.debug(`CHAT_SERVICE_HTTP_URL: ${CHAT_SERVICE_HTTP_URL}`);
logger.debug(`CHAT_SERVICE_WS_URL: ${CHAT_SERVICE_WS_URL}`);


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


/*
CONTACT SERVICE CONFIGURATION
 */

const contactServiceLink = createUploadLink({
	uri: CONTACT_SERVICE_HTTP_URL + "/graphql",
});

const contactServiceWsLink = new WebSocketLink({
	uri: CONTACT_SERVICE_WS_URL + "/graphql", options: {
		reconnect: true,
	},
});

const contactServiceApolloClientLink = split(({query}) => {
		const definition = getMainDefinition(query);
		return (definition.kind === "OperationDefinition" && definition.operation === "subscription");
	}, contactServiceWsLink, // authMiddleware.concat(httpLink),
	authMiddleware.concat(contactServiceLink), // Changed this line
)

export const contactServiceApolloClient = new ApolloClient({
	link: contactServiceApolloClientLink, cache: new InMemoryCache(),
});


/*
AUTH SERVICE CONFIGURATION
 */

const authServiceLink = createUploadLink({
	uri: AUTH_SERVICE_HTTP_URL + "/graphql",
});

const authServiceWsLink = new WebSocketLink({
	uri: AUTH_SERVICE_WS_URL + "/graphql", options: {
		reconnect: true,
	},
});

const authServiceApolloClientLink = split(({query}) => {
		const definition = getMainDefinition(query);
		return (definition.kind === "OperationDefinition" && definition.operation === "subscription");
	}, authServiceWsLink, // authMiddleware.concat(httpLink),
	authMiddleware.concat(authServiceLink), // Changed this line
)

export const authServiceApolloClient = new ApolloClient({
	link: authServiceApolloClientLink, cache: new InMemoryCache(),
});


/*
CHAT SERVICE CONFIGURATION
 */

const chatServiceLink = createUploadLink({
	uri: CHAT_SERVICE_HTTP_URL + "/graphql",
});

const chatServiceWsLink = new WebSocketLink({
	uri: CHAT_SERVICE_WS_URL + "/graphql", options: {
		reconnect: true,
	},
});

const chatServiceApolloClientLink = split(({query}) => {
		const definition = getMainDefinition(query);
		return (definition.kind === "OperationDefinition" && definition.operation === "subscription");
	}, chatServiceWsLink, // authMiddleware.concat(httpLink),
	authMiddleware.concat(chatServiceLink), // Changed this line
)

export const chatServiceApolloClient = new ApolloClient({
	link: chatServiceApolloClientLink, cache: new InMemoryCache(),
});