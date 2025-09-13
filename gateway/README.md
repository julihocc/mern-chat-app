# GraphQL Gateway

[![Version](https://img.shields.io/badge/version-v1.1.0-blue)](https://github.com/julihocc/mern-chat-app)
[![Node.js](https://img.shields.io/badge/node.js-18+-green)](https://nodejs.org/)
[![GraphQL](https://img.shields.io/badge/graphql-16.6.0-pink)](https://graphql.org/)

Unified GraphQL API gateway for the MERN Chat Application microservices architecture.

## 🌐 Overview

The Gateway serves as the central API endpoint, aggregating and federating data from all microservices into a unified GraphQL interface. It operates on **port 3001** and provides both HTTP and WebSocket endpoints for queries, mutations, and real-time subscriptions.

## 📋 Features

- **GraphQL Federation** - Unified schema from multiple services
- **Apollo Server** - Modern GraphQL server implementation
- **Real-time Subscriptions** - WebSocket support for live updates
- **Data Source Integration** - RESTDataSource for microservice communication
- **Schema Stitching** - Combine schemas from auth, chat, and contact services
- **Caching Layer** - Intelligent data caching and invalidation
- **Error Handling** - Centralized error management and reporting
- **Authentication Middleware** - JWT token validation and user context

## 🏗️ Architecture

```
gateway/
├── src/
│   ├── dataSources/
│   │   ├── AuthServiceDataSource.js    # Auth service integration
│   │   ├── ChatServiceDataSource.js    # Chat service integration
│   │   └── ContactServiceDataSource.js # Contact service integration
│   ├── graphql/
│   │   ├── typeDefs.js                 # GraphQL schema definitions
│   │   ├── resolvers.js                # Query/mutation resolvers
│   │   └── subscriptions.js            # Real-time subscriptions
│   ├── utils/
│   │   ├── authentication.js           # JWT middleware
│   │   ├── errorHandler.js             # Error handling
│   │   └── logger.js                  # Winston logging
│   └── index.js                       # Apollo Server setup
├── Dockerfile                         # Docker configuration
└── package.json                      # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- All microservices running (Auth, Chat, Contact)

### Local Development
```bash
# Navigate to service directory
cd gateway

# Install dependencies
npm install

# Set environment variables
export AUTH_SERVICE_URL=http://localhost:5000
export CHAT_SERVICE_URL=http://localhost:4500
export CONTACT_SERVICE_URL=http://localhost:4000
export PORT=3001

# Start development server
npm start
```

### Docker Development
```bash
# From project root
docker-compose up gateway
```

### Environment Variables
```bash
# Required - Service URLs
AUTH_SERVICE_URL=http://localhost:5000
CHAT_SERVICE_URL=http://localhost:4500
CONTACT_SERVICE_URL=http://localhost:4000

# Optional
PORT=3001                    # Default: 3001
NODE_ENV=development         # Default: development
GRAPHQL_PLAYGROUND=true      # Default: true in development
GRAPHQL_INTROSPECTION=true   # Default: true in development
JWT_SECRET=your_jwt_secret   # For token validation
CORS_ORIGIN=http://localhost:3000  # Frontend URL
```

## 📊 GraphQL Schema

### Core Types
```graphql
type User {
  _id: ID!
  email: String!
  username: String!
  contacts: [User!]!
  chatRooms: [ChatRoom!]!
  createdAt: String!
  lastLogin: String
}

type ChatRoom {
  _id: ID!
  name: String
  participantIds: [User!]!
  messages: [Message!]!
  createdAt: String!
  lastActivity: String
}

type Message {
  _id: ID!
  body: String!
  senderId: User!
  chatRoomId: ChatRoom!
  createdAt: String!
  updatedAt: String
}

type ContactRequest {
  _id: ID!
  senderId: User!
  recipientId: User!
  message: String
  status: ContactRequestStatus!
  createdAt: String!
}

enum ContactRequestStatus {
  PENDING
  ACCEPTED
  DECLINED
  CANCELLED
}
```

### Queries
```graphql
type Query {
  # User queries
  getCurrentUser: User
  getUser(id: ID!): User
  searchUsers(query: String!): [User!]!
  
  # Chat queries
  getChatRoomsForCurrentUser: [ChatRoom!]!
  getChatRoom(id: ID!): ChatRoom
  getMessagesByChatRoomId(chatRoomId: ID!): [Message!]!
  
  # Contact queries
  getContacts: [User!]!
  getContactRequests: [ContactRequest!]!
  getPendingRequests: [ContactRequest!]!
}
```

### Mutations
```graphql
type Mutation {
  # Authentication
  login(email: String!, password: String!): AuthPayload!
  signUp(email: String!, username: String!, password: String!, confirmPassword: String!): AuthPayload!
  logout: Boolean!
  
  # Chat operations
  createChatRoom(participantIds: [ID!]!): ChatRoom!
  sendMessage(chatRoomId: ID!, body: String!, file: String): Message!
  editMessage(id: ID!, body: String!): Message!
  deleteMessage(id: ID!): Boolean!
  
  # Contact operations
  sendContactRequest(recipientId: ID!, message: String): ContactRequest!
  respondToContactRequest(requestId: ID!, accept: Boolean!): ContactRequest!
  removeContact(contactId: ID!): Boolean!
}
```

### Subscriptions
```graphql
type Subscription {
  # Real-time messaging
  messageAdded(chatRoomId: ID!): Message!
  messageUpdated(chatRoomId: ID!): Message!
  messageDeleted(chatRoomId: ID!): ID!
  
  # User presence
  userOnlineStatus(userId: ID!): UserOnlineStatus!
  
  # Contact updates
  contactRequestReceived: ContactRequest!
  contactRequestUpdated: ContactRequest!
  
  # Chat room updates
  userJoinedChatRoom(chatRoomId: ID!): User!
  userLeftChatRoom(chatRoomId: ID!): User!
}
```

## 🔧 Data Sources

### AuthServiceDataSource
```javascript
class AuthServiceDataSource extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.AUTH_SERVICE_URL
  }

  async getCurrentUser() {
    return this.get('/v1/user')
  }

  async login(email, password) {
    return this.post('/v1/auth/login', { email, password })
  }
}
```

### ChatServiceDataSource
```javascript
class ChatServiceDataSource extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.CHAT_SERVICE_URL
  }

  async getChatRooms(userId) {
    return this.get(`/v1/chatrooms?userId=${userId}`)
  }

  async sendMessage(chatRoomId, body, senderId) {
    return this.post('/v1/messages', { chatRoomId, body, senderId })
  }
}
```

## ⚡ Real-time Features

### Subscription Implementation
```javascript
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

// Publish new message
pubsub.publish('MESSAGE_ADDED', {
  messageAdded: newMessage,
  chatRoomId: message.chatRoomId
})

// Subscribe to messages
const messageSubscription = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('MESSAGE_ADDED'),
    (payload, variables) => {
      return payload.chatRoomId === variables.chatRoomId
    }
  )
}
```

### WebSocket Configuration
```javascript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: '/graphql',
    onConnect: (connectionParams) => {
      // Validate JWT token
      return validateToken(connectionParams.authToken)
    }
  }
})
```

## 🧪 Testing

### GraphQL Playground
Access the GraphQL Playground at: `http://localhost:3001/graphql`

### Example Queries
```graphql
# Login mutation
mutation Login {
  login(email: "user@example.com", password: "password") {
    user {
      _id
      username
      email
    }
    token
  }
}

# Get current user
query GetCurrentUser {
  getCurrentUser {
    _id
    username
    email
    contacts {
      _id
      username
    }
  }
}

# Subscribe to messages
subscription MessageAdded($chatRoomId: ID!) {
  messageAdded(chatRoomId: $chatRoomId) {
    _id
    body
    senderId {
      username
    }
    createdAt
  }
}
```

## 🐳 Docker

### Build Image
```bash
docker build -t mern-chat/gateway .
```

### Run Container
```bash
docker run -p 3001:3001 \
  -e AUTH_SERVICE_URL=http://auth-service:5000 \
  -e CHAT_SERVICE_URL=http://chat-service:4500 \
  -e CONTACT_SERVICE_URL=http://contact-service:4000 \
  mern-chat/gateway
```

## ☸️ Kubernetes Deployment

```bash
# Deploy to Kubernetes
kubectl apply -f ../minikube/gateway/

# Or use deployment script
node ../minikube/gateway/deployGatewayComponents.js
```

## 🔒 Security Features

- **JWT Validation** - Verify user tokens for protected operations
- **CORS Configuration** - Secure cross-origin request handling
- **Query Complexity Analysis** - Prevent complex query attacks
- **Rate Limiting** - Protect against DDoS and abuse
- **Input Sanitization** - Validate and sanitize all inputs
- **Error Sanitization** - No sensitive data in error responses

## 📈 Performance Optimization

### Caching Strategies
```javascript
// DataLoader for batch requests
const userLoader = new DataLoader(async (userIds) => {
  const users = await authService.getUsersByIds(userIds)
  return userIds.map(id => users.find(user => user._id === id))
})

// Redis caching for frequent queries
const cachedUser = await redis.get(`user:${userId}`)
if (cachedUser) return JSON.parse(cachedUser)
```

### Query Optimization
- **Field-level caching** with Apollo Server
- **DataLoader** for N+1 query prevention
- **Query complexity limiting** to prevent abuse
- **Automatic persisted queries** for performance

## 🔍 Monitoring & Observability

### GraphQL Metrics
- **Query performance** tracking and alerts
- **Resolver execution time** monitoring
- **Subscription connection** health checks
- **Error rate** tracking and alerting

### Integration Health
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    services: {
      auth: await checkServiceHealth(AUTH_SERVICE_URL),
      chat: await checkServiceHealth(CHAT_SERVICE_URL),
      contact: await checkServiceHealth(CONTACT_SERVICE_URL)
    }
  }
  res.json(healthCheck)
})
```

## 🤝 Integration Patterns

### Error Handling
```javascript
// Standardized error responses
class ServiceError extends Error {
  constructor(message, code, service) {
    super(message)
    this.code = code
    this.service = service
  }
}

// Error formatting for GraphQL
formatError: (error) => {
  console.error(error)
  return {
    message: error.message,
    code: error.extensions?.code,
    path: error.path
  }
}
```

### Data Transformation
```javascript
// Service data normalization
const normalizeUser = (serviceUser) => ({
  _id: serviceUser._id || serviceUser.id,
  email: serviceUser.email,
  username: serviceUser.username,
  createdAt: serviceUser.createdAt || serviceUser.created_at
})
```

## 🚀 Future Enhancements

- [ ] **GraphQL Federation** - Apollo Federation for schema composition
- [ ] **Advanced Caching** - Redis and CDN integration
- [ ] **API Analytics** - Detailed usage analytics and insights
- [ ] **Schema Versioning** - Backward-compatible schema evolution
- [ ] **Batch Operations** - Optimize bulk data operations
- [ ] **Custom Directives** - Authorization and validation directives
- [ ] **File Upload** - Multipart file upload support

## 🐛 Troubleshooting

### Common Issues
1. **Service Connectivity** - Verify all microservices are running
2. **CORS Errors** - Check CORS_ORIGIN configuration
3. **WebSocket Issues** - Verify subscription server setup
4. **Authentication** - Ensure JWT_SECRET matches across services

### Debug Mode
```bash
DEBUG=apollo:* npm start
```

---

Part of the [MERN Chat Application](../README.md) microservices architecture.