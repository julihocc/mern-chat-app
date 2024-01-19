// tutorial step 2
const { createServer } = require("http");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const express = require("express");
const { execute, subscribe } = require("graphql");
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
const cors = require("cors");

async function startServer() {
  const app = express();

  const pubSub = new PubSub();

  const httpServer = createServer(app); // tutorial step 3

  const schema = makeExecutableSchema({ typeDefs, resolvers }); // tutorial step 4

  // tutorial step 5

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });


  const serverCleanup = useServer(
    {
      schema,
      execute,
      subscribe,
      onSubscribe: (ctx, msg) => {
        logger.debug(`gateway | onSubscribe: ${JSON.stringify(msg.payload)}`);
        return ctx;
      },
      context: async () => {
        const { cache } = server;

        const dataSources = {
          authAPI: new AuthAPI({ cache }),
          usersAPI: new UsersAPI({ cache }),
          chatAPI: new ChatAPI({ cache }),
        };
        return {
          dataSources, 
          pubSub
        };
      },
    },
    wsServer
  );

  // tutorial step 7

  const server = new ApolloServer({

    schema,

    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

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

  app.use("/graphql", 
  cors(), 
  express.json(), 
  expressMiddleware(server,{
    context: async ({ req, res }) => {


      const {cache} = server;
      const token = req.headers.authorization || "";
      
      req.token = token;
      req.pubSub = pubSub;

      const dataSources = {
        authAPI: new AuthAPI({cache}),
        chatAPI: new ChatAPI({cache}),
        contactAPI: new ContactAPI({cache}),
      };

      return {
        req,
        res,
        token,
        pubSub,
        dataSources,
      };
    }
  }
  ));

  const PORT = process.env.PORT || 3001;

  httpServer.listen(PORT, () => {
    logger.debug(
      `Server is running at http://localhost:${PORT}/graphql`
    );
    logger.debug(
      `Subscriptions ready at ws://localhost:${PORT}/graphql`
    );
  });
}

startServer();
