// backend/src/server.js

// Path: backend\src\server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const cors = require('cors');
const typeDefs = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
const errorHandler = require('./errorHandler');
const connectDB = require('./connectDB');
const http = require('http');
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');
const logger = require('./logger');
const { graphqlUploadExpress } = require('graphql-upload'); // I've kept this line, as it might be used for other configurations

const app = express();

app.use(express.static(__dirname + '/public'));

const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// I've updated the maxFileSize value to 10MB
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

app.use(errorHandler);

app.use(cookieParser());
async function startServer() {
    try {
        await connectDB();
        //logger.info('Connected to MongoDB'); // No change here
    } catch (err) {
        logger.error('Error connecting to MongoDB:', err); // No change here
    }

    const pubSub = new PubSub();

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        context: ({ req, connection }) => {
            if (connection) {
                return { ...connection.context, pubSub };
            } else {
                const token = req.headers.authorization || '';
                return { req, pubSub, token };
            }
        },
        uploads: false, // Keeping this line as-is, assuming you have other handling for uploads
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    const httpServer = http.createServer(app);

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
        const now = new Date();
        logger.info(`Server started at ${now.toISOString()}`); // No change here
        logger.info(`Server is running at http://localhost:${PORT}${apolloServer.graphqlPath}`); // No change here
        logger.info(`Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`); // No change here
    });

}

(async () => {
    try {
        await startServer();
    } catch (err) {
        logger.error('Error starting the backend:', err); // No change here
    }
})();
