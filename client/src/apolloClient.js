import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
});

const wsLink = new WebSocketLink({
    // uri: 'ws://localhost:4000/useChatRoomQuery',
    uri: 'ws://localhost:4000/graphql',
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
    authLink.concat(httpLink),
);

const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

export default apolloClient;
