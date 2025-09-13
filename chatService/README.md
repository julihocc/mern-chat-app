# Chat Service

[![Version](https://img.shields.io/badge/version-v1.1.0-blue)](https://github.com/julihocc/mern-chat-app)
[![Node.js](https://img.shields.io/badge/node.js-18+-green)](https://nodejs.org/)

Real-time messaging and chat room management microservice for the MERN Chat Application.

## 💬 Overview

The Chat Service handles all chat-related operations including chat room creation, message management, real-time communication, and message history. It operates on **port 4500** with its dedicated MongoDB instance on **port 27020**.

## 📋 Features

- **Chat Room Management** - Create, join, and manage chat rooms
- **Real-time Messaging** - WebSocket-based live messaging
- **Message History** - Persistent message storage and retrieval
- **User Participation** - Multi-user chat room participation
- **Message Types** - Text messages with future support for media
- **Message Validation** - Content validation and sanitization
- **Pagination Support** - Efficient message history loading
- **Error Handling** - Comprehensive error management with logging

## 🏗️ Architecture

```
chatService/
├── src/
│   ├── controllers/
│   │   ├── ChatController.js     # Chat room operations
│   │   ├── MessageController.js  # Message CRUD operations
│   │   └── UserController.js     # User chat operations
│   ├── models/
│   │   ├── ChatRoomModel.js     # Chat room schema
│   │   ├── MessageModel.js      # Message schema
│   │   └── UserModel.js         # User reference schema
│   ├── utils/
│   │   ├── connectDB.js         # MongoDB connection
│   │   ├── errorHandler.js      # Error handling
│   │   └── logger.js           # Winston logging
│   └── index.js                # Express server setup
├── Dockerfile                  # Docker configuration
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (or Docker)

### Local Development
```bash
# Navigate to service directory
cd chatService

# Install dependencies
npm install

# Set environment variables
export MONGODB_URI=mongodb://localhost:27020/chatdb
export PORT=4500

# Start development server
npm start
```

### Docker Development
```bash
# From project root
docker-compose up chatservice mongodb-chat
```

### Environment Variables
```bash
# Required
MONGODB_URI=mongodb://localhost:27020/chatdb

# Optional
PORT=4500                    # Default: 4500
NODE_ENV=development         # Default: development
MAX_MESSAGE_LENGTH=1000      # Default: 1000 characters
PAGINATION_LIMIT=50          # Default: 50 messages per page
```

## 🔧 API Endpoints

### Chat Rooms
```http
GET    /v1/chatrooms              # Get user's chat rooms
POST   /v1/chatrooms              # Create new chat room
GET    /v1/chatrooms/:id          # Get specific chat room
PUT    /v1/chatrooms/:id          # Update chat room
DELETE /v1/chatrooms/:id          # Delete chat room
POST   /v1/chatrooms/:id/join     # Join chat room
POST   /v1/chatrooms/:id/leave    # Leave chat room
```

### Messages
```http
GET    /v1/messages/:chatRoomId   # Get messages for chat room
POST   /v1/messages               # Send new message
GET    /v1/messages/:id           # Get specific message
PUT    /v1/messages/:id           # Update message (edit)
DELETE /v1/messages/:id           # Delete message
```

### Real-time Events
```http
WebSocket /ws                     # Real-time message events
```

## 📊 Data Models

### ChatRoom Schema
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  participantIds: [ObjectId] (refs to users),
  creatorId: ObjectId (ref to user),
  createdAt: Date,
  updatedAt: Date,
  lastActivity: Date,
  isPrivate: Boolean (default: false),
  settings: {
    maxParticipants: Number,
    allowInvites: Boolean,
    moderators: [ObjectId]
  }
}
```

### Message Schema
```javascript
{
  _id: ObjectId,
  body: String (required, max: 1000),
  senderId: ObjectId (ref to user, required),
  chatRoomId: ObjectId (ref to chat room, required),
  messageType: String (text, image, file),
  createdAt: Date,
  updatedAt: Date,
  editedAt: Date,
  isDeleted: Boolean (default: false),
  metadata: {
    fileUrl: String,
    fileName: String,
    fileSize: Number,
    mimeType: String
  }
}
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 🐳 Docker

### Build Image
```bash
docker build -t mern-chat/chat-service .
```

### Run Container
```bash
docker run -p 4500:4500 \
  -e MONGODB_URI=mongodb://mongo:27017/chatdb \
  mern-chat/chat-service
```

## ☸️ Kubernetes Deployment

```bash
# Deploy to Kubernetes
kubectl apply -f ../minikube/chat-service/

# Or use deployment script
node ../minikube/chat-service/deployChatServiceComponents.js
```

## ⚡ Real-time Features

### WebSocket Integration
- **Connection Management** - Handle client connections and disconnections
- **Room Management** - Subscribe/unsubscribe from chat room events
- **Message Broadcasting** - Real-time message delivery to room participants
- **Typing Indicators** - Show when users are typing (future feature)
- **Online Status** - Track user presence in chat rooms

### Event Types
```javascript
// Incoming Events
{
  type: 'join_room',
  chatRoomId: 'room_id'
}

{
  type: 'send_message', 
  chatRoomId: 'room_id',
  message: 'Hello world!'
}

// Outgoing Events
{
  type: 'new_message',
  message: MessageObject
}

{
  type: 'user_joined',
  userId: 'user_id',
  chatRoomId: 'room_id'
}
```

## 🔒 Security Features

- **Message Validation** - Input sanitization and length limits
- **Room Authorization** - Verify user participation before message operations
- **Rate Limiting** - Prevent message spam and abuse
- **Content Filtering** - Basic content moderation capabilities
- **User Verification** - Ensure authenticated users only

## 📈 Performance

- **MongoDB Indexing** - Optimized queries for messages and rooms
- **Pagination** - Efficient message history loading
- **Connection Pooling** - WebSocket connection optimization
- **Caching Strategy** - Frequently accessed data caching
- **Query Optimization** - Aggregation pipelines for complex queries

## 🔍 Monitoring & Logging

- **Message Analytics** - Track message volume and patterns
- **Performance Metrics** - Response time and throughput monitoring
- **Error Tracking** - Comprehensive error logging
- **User Activity** - Track user engagement and participation

## 🤝 Integration

### With Gateway
The Chat Service integrates with the GraphQL Gateway through:
- REST API endpoints consumed by ChatServiceDataSource
- Real-time subscriptions for live messaging
- Chat room and message data provision

### With Other Services
- **Auth Service** - User authentication and profile data
- **Contact Service** - User relationships for private messaging
- **Frontend** - Real-time UI updates and messaging interface

## 📝 Development Notes

- Uses **Express.js** for HTTP server
- **Socket.io** for WebSocket management (future implementation)
- **Mongoose ODM** for MongoDB operations
- **Winston** for structured logging
- **Express Rate Limit** for API protection

## 🚀 Future Enhancements

- [ ] **File Sharing** - Support for images, documents, and media
- [ ] **Message Reactions** - Emoji reactions to messages
- [ ] **Message Threading** - Reply-to-message functionality
- [ ] **Voice Messages** - Audio message support
- [ ] **Message Search** - Full-text search across message history
- [ ] **Moderation Tools** - Content filtering and user management
- [ ] **Message Encryption** - End-to-end encryption for private chats

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection** - Ensure MongoDB is running on port 27020
2. **Port Conflicts** - Check if port 4500 is available
3. **WebSocket Issues** - Verify WebSocket server configuration
4. **Memory Usage** - Monitor for message history memory leaks

### Debug Mode
```bash
DEBUG=chat:* npm start
```

---

Part of the [MERN Chat Application](../README.md) microservices architecture.