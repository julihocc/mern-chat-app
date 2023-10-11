// Path: backend\src\server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const cors = require('cors');
const { typeDefs} = require('./graphql/typeDefs');
const { resolvers } = require('./graphql/resolvers');
const errorHandler = require('./errorHandler');
const connectDB = require('./connectDB');
const http = require('http');
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');
const logger = require('./logger');
const { graphqlUploadExpress } = require('graphql-upload');

const app = express();

app.use(express.static(__dirname + '/public'));

const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions));

// Add the following lines to apply the graphqlUploadExpress middleware
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

app.use(errorHandler);

app.use(cookieParser());
async function startServer() {
    try {
        await connectDB();
        //logger.debug('Connected to MongoDB'); // Changed this line
    } catch (err) {
        logger.error('Error connecting to MongoDB:', err); // And this line
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
        uploads: false,
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
        logger.debug(`Server is running at http://localhost:${PORT}${apolloServer.graphqlPath}`); // Changed this line
        logger.debug(`Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`); // And this line
    });

}

(async () => {
    try {
        await startServer();
    } catch (err) {
        logger.error('Error starting the backend:', err); // Changed this line
    }
})();
