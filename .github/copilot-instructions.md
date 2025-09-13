# Copilot Instructions for AI Coding Agents

## Project Overview
- **Architecture:** This is a microservices-based MERN chat application. Major services are:
  - `authService`: Handles authentication and user management.
  - `chatService`: Manages chat rooms and messages.
  - `contactService`: Manages user contacts.
  - `gateway`: GraphQL API gateway for service aggregation.
  - `frontend`: React app using Apollo Client for GraphQL.
- **Data Flow:** Each service has its own MongoDB instance. Services communicate via HTTP/GraphQL, orchestrated by the gateway.
- **Deployment:** Supports both Docker Compose and Minikube (Kubernetes). See root `README.md` for commands.

## Key Workflows
- **Local Development:**
  - Use `docker-compose up` from the project root to start all services.
  - For Kubernetes, use manifests in `minikube/` and follow the `README.md` steps.
- **Service Structure:**
  - Each service has its own `Dockerfile`, `package.json`, and `src/` with `controllers/`, `models/`, and `utils/`.
  - MongoDB connection logic is in `utils/connectDB.js` per service.
- **Frontend:**
  - Located in `frontend/`. Uses Apollo Client (`src/apolloClient.js`) to connect to the gateway.
  - Main routing in `src/MainRoutes.js`.

## Project Conventions
- **Controllers:** All business logic is in `controllers/` per service. Example: `authService/src/controllers/UserController.js`.
- **Models:** Mongoose schemas in `models/` per service.
- **Error Handling:** Centralized in `utils/errorHandler.js` per service.
- **Logging:** Use `utils/logger.js` for service logs.
- **Password Handling:** `authService/src/utils/passwordValidator.js` and `PasswordController.js`.
- **GraphQL:** Gateway aggregates schemas and resolvers from services. See `gateway/src/`.

## Integration & Patterns
- **Service Communication:**
  - Gateway uses Apollo Server to federate service APIs.
  - Services are decoupled; communicate via REST or GraphQL endpoints.
- **External Dependencies:**
  - MongoDB for each service (see `minikube/` for manifests).
  - Apollo Client/Server for GraphQL.
- **React Buddy:** Frontend supports [React Buddy](https://plugins.jetbrains.com/plugin/17467-react-buddy/) for UI prototyping (see `frontend/src/dev/README.md`).

## Examples
- To add a new REST endpoint: Create a controller in `src/controllers/`, update routes in `src/index.js`.
- To add a new GraphQL resolver: Update schema/resolvers in `gateway/src/graphql/`.
- To add a new frontend page: Add a component in `frontend/src/components/` and route in `MainRoutes.js`.

## References
- Root `README.md`: Build/run instructions, deployment commands.
- `minikube/`: Kubernetes manifests for all services.
- `frontend/src/dev/README.md`: React Buddy usage.

---

If you are unsure about a workflow or pattern, check the referenced files or ask for clarification.
