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
const cors = require("cors");
const { tokenFromRequest } = require("./utils/requestToken");

function buildDataSources(cache) {
  return {
    authAPI: new AuthAPI({ cache }),
    chatAPI: new ChatAPI({ cache }),
    contactAPI: new ContactAPI({ cache }),
  };
}

async function startServer() {
  const app = express();

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  let server;

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        const token = tokenFromRequest(ctx.extra && ctx.extra.request);
        const dataSources = buildDataSources(server.cache);
        let userId = null;
        if (token) {
          try {
            const user = await dataSources.authAPI.getUserByToken(token);
            userId = user && user._id ? String(user._id) : null;
          } catch (err) {
            logger.debug("Subscription auth failed");
            userId = null;
          }
        }
        return {
          token,
          dataSources,
          userId,
        };
      },
    },
    wsServer
  );

  server = new ApolloServer({
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

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  };

  app.use(
    "/graphql",
    cors(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return {
          req,
          res,
          token: tokenFromRequest(req),
          dataSources: buildDataSources(server.cache),
        };
      },
    })
  );

  const PORT = process.env.PORT || 3001;

  httpServer.listen(PORT, () => {
    logger.debug(`Server is running at http://localhost:${PORT}/graphql`);
    logger.debug(`Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
}

startServer();
