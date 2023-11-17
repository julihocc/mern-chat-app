const {ApolloServer} = require('apollo-server');
const {ApolloGateway, IntrospectAndCompose} = require('@apollo/gateway');


async function startServer() {

	const gateway = new ApolloGateway({
		supergraphSdl: new IntrospectAndCompose({
			subgraphs: [
				{name: 'auth', url: 'http://localhost:4001/graphql'},
				// Add other services here as you federate them
			],
		}),
	});

	const server = new ApolloServer({
		gateway,
		subscriptions: false,
		context: ({req}) => {
			return { headers: req.headers };
		}
	});

	server.listen().then(({url}) => {
		console.log(`🚀 Server ready at ${url}`);
	});


}

(async () => {
	try {
		await startServer();
	} catch (err) {
		console.error("Error starting the authentication service:", err);
	}
})();