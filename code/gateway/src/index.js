const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { execute, subscribe } = require("graphql");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { useServer } = require("graphql-ws/lib/use/ws");
const { WebSocketServer } = require("ws");
const http = require("http");
const { typeDefs } = require("./graphql/typeDefs");
const { resolvers } = require("./graphql/resolvers");
const errorHandler = require("./utils/errorHandler");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");
const { graphqlUploadExpress } = require("graphql-upload");
const rateLimit = require("express-rate-limit");
const { AuthAPI } = require("./dataSources/AuthServiceDataSource");
const { ChatAPI } = require("./dataSources/ChatServiceDataSource");
const { ContactAPI } = require("./dataSources/ContactServiceDataSource");
const { PubSub } = require("graphql-subscriptions");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(__dirname + "/public"));

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10000, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after an hour",
});

app.use("/graphql", apiLimiter);
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
app.use(errorHandler);
app.use(cookieParser());

app.use((req, res, next) => {
  const token = req.cookies.authToken;
  if (token) {
    logger.debug(`gateway | Token: ${token}`);
    req.token = token;
  }
  next();
});

const pubSub = new PubSub();

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res, connection }) => {
      if (connection) {
        return { ...connection.context, pubSub };
      } else {
        const token = req.headers.authorization || "";
        req.token = token;
        req.pubSub = pubSub;
        return { req, res, token, pubSub };
      }
    },
    // subscriptions: {
    //   onConnect: () => {
    //     // This context is merged with the context from the Apollo Server setup
    //     return { pubSub };
    //   },
    // },
    dataSources: () => ({
      authAPI: new AuthAPI(),
      chatAPI: new ChatAPI(),
      contactAPI: new ContactAPI(),
    }),
    uploads: false,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: apolloServer.graphqlPath,
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  
  useServer(
    {
      schema,
      execute,
      subscribe,
      onSubscribe: (ctx, msg) => {
        return { ...ctx, pubSub };
      },
    },
    wsServer
  );

  httpServer.listen(PORT, () => {
    logger.debug(
      `Server is running at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
    logger.debug(
      `Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
}

startServer();
