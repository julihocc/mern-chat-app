# Auth Service

[![Version](https://img.shields.io/badge/version-v1.1.0-blue)](https://github.com/julihocc/mern-chat-app)
[![Node.js](https://img.shields.io/badge/node.js-18+-green)](https://nodejs.org/)

Authentication and user management microservice for the MERN Chat Application.

## 🔐 Overview

The Auth Service handles all authentication-related operations including user registration, login, JWT token management, and user profile operations. It operates on **port 5000** with its dedicated MongoDB instance on **port 27018**.

## 📋 Features

- **User Registration & Login** - Secure account creation and authentication
- **JWT Token Management** - Stateless authentication with HTTP-only cookies
- **Password Security** - Bcrypt hashing with salt rounds
- **User Profile Management** - CRUD operations for user data
- **Contact Management** - User contact relationships
- **Rate Limiting** - 10,000 requests per hour per IP
- **Input Validation** - Comprehensive data validation and sanitization
- **Error Handling** - Centralized error management with Winston logging

## 🏗️ Architecture

```
authService/
├── src/
│   ├── controllers/
│   │   ├── UserController.js      # User CRUD operations
│   │   └── PasswordController.js  # Password management
│   ├── models/
│   │   └── UserModel.js          # Mongoose user schema
│   ├── utils/
│   │   ├── connectDB.js          # MongoDB connection
│   │   ├── authentication.js     # JWT middleware
│   │   ├── passwordValidator.js  # Password validation
│   │   ├── errorHandler.js       # Error handling
│   │   └── logger.js            # Winston logging
│   └── index.js                 # Express server setup
├── Dockerfile                   # Docker configuration
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (or Docker)

### Local Development
```bash
# Navigate to service directory
cd authService

# Install dependencies
npm install

# Set environment variables
export MONGODB_URI=mongodb://localhost:27018/authdb
export JWT_SECRET=your_jwt_secret_key
export PORT=5000

# Start development server
npm start
```

### Docker Development
```bash
# From project root
docker-compose up authservice mongodb-auth
```

### Environment Variables
```bash
# Required
MONGODB_URI=mongodb://localhost:27018/authdb
JWT_SECRET=your_jwt_secret_key_here

# Optional
PORT=5000                    # Default: 5000
NODE_ENV=development         # Default: development
BCRYPT_SALT_ROUNDS=12       # Default: 12
JWT_EXPIRES_IN=7d           # Default: 7d
RATE_LIMIT_REQUESTS=10000   # Default: 10000/hour
```

## 🔧 API Endpoints

### Authentication
```http
POST /v1/auth/register
POST /v1/auth/login
POST /v1/auth/logout
POST /v1/auth/refresh
GET  /v1/auth/verify
```

### User Management
```http
GET    /v1/user              # Get current user
PUT    /v1/user              # Update user profile
DELETE /v1/user              # Delete user account
GET    /v1/user/contacts     # Get user contacts
POST   /v1/user/contacts     # Add contact
DELETE /v1/user/contacts/:id # Remove contact
```

### Password Management
```http
POST /v1/password/change     # Change password
POST /v1/password/reset      # Request reset
POST /v1/password/confirm    # Confirm reset
```

## 📊 Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  username: String (unique, required),
  password: String (hashed, required),
  contacts: [ObjectId] (refs to other users),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean (default: true),
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
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
docker build -t mern-chat/auth-service .
```

### Run Container
```bash
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongo:27017/authdb \
  -e JWT_SECRET=your_secret \
  mern-chat/auth-service
```

## ☸️ Kubernetes Deployment

```bash
# Deploy to Kubernetes
kubectl apply -f ../minikube/auth-service/

# Or use deployment script
node ../minikube/auth-service/deployAuthServiceComponents.js
```

## 🔒 Security Features

- **Password Hashing** - Bcrypt with configurable salt rounds
- **JWT Security** - Secure token generation and validation
- **Rate Limiting** - Express rate limiter middleware
- **Input Sanitization** - Mongoose validation and custom validators
- **Error Sanitization** - No sensitive data in error responses
- **CORS Configuration** - Properly configured cross-origin requests

## 📈 Performance

- **MongoDB Indexing** - Optimized queries with proper indexes
- **Connection Pooling** - Mongoose connection optimization
- **Error Caching** - Efficient error handling and logging
- **Lightweight Response** - Minimal data transfer

## 🔍 Monitoring & Logging

- **Winston Logging** - Structured logging with multiple transports
- **Request Logging** - HTTP request/response logging
- **Error Tracking** - Comprehensive error logging and alerting
- **Health Checks** - Service health monitoring endpoints

## 🤝 Integration

### With Gateway
The Auth Service integrates with the GraphQL Gateway through:
- REST API endpoints consumed by AuthServiceDataSource
- User authentication and profile data provision
- JWT token validation middleware

### With Other Services
- **Contact Service** - User contact relationships
- **Chat Service** - User participation in chat rooms
- **Frontend** - Authentication state management

## 📝 Development Notes

- Uses **Express.js** for HTTP server
- **Mongoose ODM** for MongoDB operations  
- **JWT** for stateless authentication
- **Bcrypt** for password hashing
- **Winston** for structured logging
- **Express Rate Limit** for DoS protection

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection** - Ensure MongoDB is running and accessible
2. **JWT Errors** - Verify JWT_SECRET is properly set
3. **Port Conflicts** - Check if port 5000 is available
4. **CORS Issues** - Verify CORS configuration in gateway

### Debug Mode
```bash
DEBUG=auth:* npm start
```

---

Part of the [MERN Chat Application](../README.md) microservices architecture.