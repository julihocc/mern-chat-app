const { ApolloServer } = require('apollo-server');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');

const gateway = new ApolloGateway({
	supergraphSdl: new IntrospectAndCompose({
		subgraphs: [
			{ name: 'auth', url: 'http://localhost:4001' },
			// Add other services here as you federate them
		],
	}),
});

const server = new ApolloServer({ gateway, subscriptions: false });

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});


