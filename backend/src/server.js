// backend/scr/backend.js
const express = require('express');
const { ApolloServer} = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const cors = require('cors');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/connectDB');
const http = require('http');
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.static(__dirname + '/public'));

const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions));

// connectDB();
app.use(errorHandler);

app.use(cookieParser());
async function startServer() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }

    const pubSub = new PubSub();

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        context: ({ req, connection }) => {
            if (connection) {
                // For WebSocket connections
                return { ...connection.context, pubsub: pubSub };
            } else {
                // For HTTP requests
                const token = req.headers.authorization || '';
                return { req, pubsub: pubSub, token };
            }
        },
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    const httpServer = http.createServer(app);

    // Set up the SubscriptionServer
    SubscriptionServer.create(
        {
            schema: apolloServer.schema,
            execute,
            subscribe,
        },
        {
            server: httpServer,
            path: apolloServer.graphqlPath,
        }
    );

    httpServer.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}${apolloServer.graphqlPath}`);
        console.log(`Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`);
    });

}

(async () => {
    try {
        await startServer();
    } catch (err) {
        console.error('Error starting the backend:', err);
    }
})();
