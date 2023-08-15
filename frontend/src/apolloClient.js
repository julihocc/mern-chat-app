// frontend\src\apolloClient.js
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

const HTTP_URL = "http://localhost:4000";
const WS_URL = "ws://localhost:4000";

// const httpLink = new HttpLink({
//     uri: HTTP_URL + "/graphql",
// });

const uploadLink = createUploadLink({ // Changed this line
    uri: HTTP_URL + "/graphql",
});

const wsLink = new WebSocketLink({
    uri: WS_URL + "/graphql",
    options: {
        reconnect: true,
    },
});


const authLink = setContext((_, { headers }) => {
    const tokenCookie = document.cookie.split('; ').find((row) => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : '';

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    // authLink.concat(httpLink),
    authLink.concat(uploadLink), // Changed this line
);

const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

export default apolloClient;
