# Copilot Instructions for AI Coding Agents

## Project Overview - v0.2.0
- **Architecture:** This is a microservices-based MERN chat application with modern tooling and comprehensive TDD setup. Major services are:
  - `authService` (v1.1.0): Handles authentication and user management (port 5000, MongoDB on 27018).
  - `chatService` (v1.1.0): Manages chat rooms and messages (port 4500, MongoDB on 27020).
  - `contactService` (v1.1.0): Manages user contacts (port 4000, MongoDB on 27019).
  - `gateway` (v1.1.0): GraphQL API gateway for service aggregation (port 3001).
  - `frontend` (v0.2.0): React app using Vite build system, Apollo Client for GraphQL (port 3000).
- **Data Flow:** Each service has its own MongoDB instance. Services communicate via HTTP/GraphQL, orchestrated by the gateway. Gateway uses Apollo Server with federated data sources (AuthAPI, ChatAPI, ContactAPI) and WebSocket support for subscriptions.
- **Build System:** Frontend migrated from Create React App to **Vite 4.4.5** for faster development and optimized production builds.
- **Testing:** Comprehensive **Test-Driven Development (TDD)** setup with **Vitest 3.2.4**, **React Testing Library**, **MSW**, and **jsdom**.
- **Deployment:** Supports both Docker Compose and Minikube (Kubernetes). See root `README.md` for commands. Use `docker-compose up` for local dev; manifests in `minikube/` for K8s.

## Key Workflows
- **Local Development:**
  - Use `docker-compose up` from the project root to start all services with their MongoDB instances.
  - For Kubernetes, apply manifests in `minikube/` subdirs (e.g., `kubectl apply -f minikube/auth-service/`).
- **Service Structure:**
  - Each service has `Dockerfile`, `package.json`, and `src/` with `controllers/`, `models/`, and `utils/`.
  - MongoDB connection in `utils/connectDB.js` per service (e.g., `authService/src/utils/connectDB.js`).
  - Start services with `npm start` (uses nodemon for dev).
- **Frontend (Vite + TDD):**
  - Located in `frontend/`. **Migrated to Vite** from Create React App for faster development.
  - Uses **Vitest** for testing with comprehensive TDD setup in `src/test/`.
  - Apollo Client (`src/apolloClient.js`) with HTTP/WS links split for queries/subscriptions.
  - Auth via cookies; connects to gateway at `http://localhost:3001/graphql`.
  - Main routing in `src/MainRoutes.js`; uses Material-UI, Redux, React Router.
  - **TDD Workflow:** Use `npm run test:watch` for continuous testing during development.
  - **Testing Infrastructure:** MSW for API mocking, React Testing Library for component tests.
  - **Documentation:** See `frontend/TESTING.md` for testing guide, `frontend/TDD_EXAMPLE.md` for workflow examples.

## Project Conventions
- **Controllers:** All business logic in `controllers/` per service. Example: `authService/src/controllers/UserController.js` handles user CRUD with JWT tokens.
- **Models:** Mongoose schemas in `models/` per service. Example: `UserModel.js` with email, username, password, contacts array.
- **Error Handling:** Centralized in `utils/errorHandler.js` per service; uses Winston for logging in `utils/logger.js`.
- **Password Handling:** `authService/src/utils/passwordValidator.js` and `PasswordController.js` for validation and hashing.
- **GraphQL:** Gateway aggregates schemas/resolvers from services. Types in `gateway/src/graphql/typeDefs.js` (e.g., User, ChatRoom, Message); resolvers delegate to data sources.
- **Authentication:** JWT-based; tokens stored in cookies; middleware in Apollo Client for headers.

## Integration & Patterns
- **Service Communication:**
  - Gateway uses Apollo Server to federate service APIs via data sources (e.g., `gateway/src/dataSources/AuthServiceDataSource.js`).
  - Services are decoupled; communicate via REST endpoints or GraphQL resolvers.
- **External Dependencies:**
  - MongoDB per service (see `docker-compose.yaml` for configs).
  - Apollo Client/Server for GraphQL; GraphQL-WS for subscriptions.
  - **Vite 4.4.5** for fast development and optimized builds.
  - **Vitest 3.2.4** with React Testing Library, MSW, and jsdom for comprehensive testing.
  - React Buddy for UI prototyping (see `frontend/src/dev/README.md`).
- **Rate Limiting:** Applied in services using `express-rate-limit` (e.g., 10k requests/hour per IP in authService).

## Examples
- To add a new REST endpoint: Create controller method in `src/controllers/`, update routes in `src/index.js` (e.g., `app.post('/v1/user', UserController.createUser)`).
- To add a new GraphQL resolver: Update `gateway/src/graphql/resolvers.js` to delegate to service data source.
- To add a new frontend page: Add component in `frontend/src/components/`, route in `MainRoutes.js`.
- To add a new model field: Update Mongoose schema in `models/`, ensure controller handles it.

## References
- Root `README.md`: Build/run instructions, deployment commands.
- `docker-compose.yaml`: Service ports, env vars, dependencies.
- `minikube/`: Kubernetes manifests for all services.
- `frontend/src/dev/README.md`: React Buddy usage.
- `frontend/TESTING.md`: TDD setup and testing guide.
- `frontend/TDD_EXAMPLE.md`: TDD workflow examples.

---

If you are unsure about a workflow or pattern, check the referenced files or ask for clarification.
