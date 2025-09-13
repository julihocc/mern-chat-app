# Contact Service

[![Version](https://img.shields.io/badge/version-v1.1.0-blue)](https://github.com/julihocc/mern-chat-app)
[![Node.js](https://img.shields.io/badge/node.js-18+-green)](https://nodejs.org/)

User contact management and relationships microservice for the MERN Chat Application.

## 👥 Overview

The Contact Service manages user relationships, contact requests, and social connections within the chat application. It operates on **port 4000** with its dedicated MongoDB instance on **port 27019**.

## 📋 Features

- **Contact Management** - Add, remove, and manage user contacts
- **Contact Requests** - Send and respond to friend requests
- **User Discovery** - Search and find other users
- **Relationship Status** - Track contact relationships and status
- **Privacy Controls** - Manage contact visibility and privacy
- **Bulk Operations** - Import/export contact lists
- **Contact Groups** - Organize contacts into custom groups
- **Activity Tracking** - Monitor contact interactions

## 🏗️ Architecture

```
contactService/
├── src/
│   ├── controllers/
│   │   ├── ContactController.js  # Contact CRUD operations
│   │   ├── ChatController.js     # Chat integration
│   │   └── UserController.js     # User operations
│   ├── models/
│   │   └── (Shared models)      # Contact-related schemas
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
cd contactService

# Install dependencies
npm install

# Set environment variables
export MONGODB_URI=mongodb://localhost:27019/contactdb
export PORT=4000

# Start development server
npm start
```

### Docker Development
```bash
# From project root
docker-compose up contactservice mongodb-contact
```

### Environment Variables
```bash
# Required
MONGODB_URI=mongodb://localhost:27019/contactdb

# Optional
PORT=4000                    # Default: 4000
NODE_ENV=development         # Default: development
MAX_CONTACTS_PER_USER=1000   # Default: 1000
SEARCH_RESULTS_LIMIT=50      # Default: 50 users per search
```

## 🔧 API Endpoints

### Contact Management
```http
GET    /v1/contacts              # Get user's contacts
POST   /v1/contacts              # Add new contact
DELETE /v1/contacts/:id          # Remove contact
GET    /v1/contacts/:id          # Get contact details
PUT    /v1/contacts/:id          # Update contact info
```

### Contact Requests
```http
GET    /v1/requests              # Get pending requests
POST   /v1/requests              # Send contact request
PUT    /v1/requests/:id/accept   # Accept request
PUT    /v1/requests/:id/decline  # Decline request
DELETE /v1/requests/:id          # Cancel request
```

### User Discovery
```http
GET    /v1/users/search          # Search for users
GET    /v1/users/suggestions     # Get contact suggestions
GET    /v1/users/:id             # Get user profile
```

### Contact Groups
```http
GET    /v1/groups               # Get contact groups
POST   /v1/groups               # Create new group
PUT    /v1/groups/:id           # Update group
DELETE /v1/groups/:id           # Delete group
POST   /v1/groups/:id/contacts  # Add contacts to group
```

## 📊 Data Models

### Contact Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to user),
  contactId: ObjectId (ref to user),
  status: String (pending, accepted, blocked),
  nickname: String,
  notes: String,
  groupIds: [ObjectId] (refs to contact groups),
  createdAt: Date,
  updatedAt: Date,
  lastInteraction: Date,
  isFavorite: Boolean (default: false),
  metadata: {
    source: String (search, invite, mutual),
    mutualContacts: Number,
    commonInterests: [String]
  }
}
```

### ContactRequest Schema
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref to user),
  recipientId: ObjectId (ref to user),
  message: String,
  status: String (pending, accepted, declined, cancelled),
  createdAt: Date,
  respondedAt: Date,
  expiresAt: Date
}
```

### ContactGroup Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to user),
  name: String (required),
  description: String,
  color: String,
  contactIds: [ObjectId] (refs to contacts),
  createdAt: Date,
  updatedAt: Date,
  isDefault: Boolean (default: false)
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
docker build -t mern-chat/contact-service .
```

### Run Container
```bash
docker run -p 4000:4000 \
  -e MONGODB_URI=mongodb://mongo:27017/contactdb \
  mern-chat/contact-service
```

## ☸️ Kubernetes Deployment

```bash
# Deploy to Kubernetes
kubectl apply -f ../minikube/contact-service/

# Or use deployment script
node ../minikube/contact-service/deployContactServiceComponents.js
```

## 🔍 Contact Discovery Features

### Search Capabilities
- **Username Search** - Find users by exact or partial username
- **Email Search** - Search by email address (privacy-aware)
- **Fuzzy Matching** - Intelligent search with typo tolerance
- **Advanced Filters** - Filter by various user attributes

### Suggestion Algorithm
```javascript
// Contact suggestion factors
const suggestionScore = {
  mutualContacts: weight * 0.4,
  commonInterests: weight * 0.3,
  activityLevel: weight * 0.2,
  proximity: weight * 0.1
}
```

## 🔒 Privacy & Security

- **Privacy Controls** - Users can control who can find them
- **Blocked Users** - Comprehensive blocking and reporting system
- **Request Limits** - Rate limiting for contact requests
- **Data Encryption** - Sensitive contact data encryption
- **Audit Trail** - Track all contact-related activities

## 📈 Performance

- **Caching Layer** - Redis for frequently accessed contact data
- **Batch Operations** - Efficient bulk contact operations
- **Search Optimization** - Elasticsearch integration for search
- **Pagination** - Efficient contact list loading
- **Index Strategy** - Optimized MongoDB indexes

## 🔍 Analytics & Insights

### Contact Metrics
- **Network Growth** - Track user network expansion
- **Engagement Patterns** - Analyze contact interaction frequency
- **Popular Features** - Monitor feature usage statistics
- **Connection Success** - Track request acceptance rates

### Privacy-Aware Analytics
- All analytics respect user privacy settings
- Aggregated data only, no individual tracking
- Opt-out capabilities for all analytics

## 🤝 Integration

### With Gateway
The Contact Service integrates with the GraphQL Gateway through:
- REST API endpoints consumed by ContactServiceDataSource
- User relationship data provision
- Contact search and discovery features

### With Other Services
- **Auth Service** - User authentication and profile validation
- **Chat Service** - Contact-based chat room creation
- **Frontend** - Contact management UI and real-time updates

## 📝 Development Notes

- Uses **Express.js** for HTTP server
- **Mongoose ODM** for MongoDB operations
- **Redis** for caching (future implementation)
- **Elasticsearch** for search (future implementation)
- **Winston** for structured logging

## 🚀 Future Enhancements

- [ ] **Smart Suggestions** - AI-powered contact recommendations
- [ ] **Social Import** - Import contacts from social platforms
- [ ] **QR Code Sharing** - Easy contact sharing via QR codes
- [ ] **Location-based Discovery** - Find nearby users (opt-in)
- [ ] **Contact Sync** - Synchronize with phone contacts
- [ ] **Advanced Groups** - Hierarchical contact organization
- [ ] **Contact Notes** - Rich text notes for contacts
- [ ] **Interaction History** - Track communication patterns

## 🔄 Data Synchronization

### Real-time Updates
- **Contact Status Changes** - Live updates when contacts come online
- **Request Notifications** - Instant contact request notifications
- **Group Updates** - Real-time group membership changes

### Conflict Resolution
- **Last Write Wins** - Simple conflict resolution strategy
- **Optimistic Locking** - Prevent concurrent modification issues
- **Event Sourcing** - Track all contact-related events

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection** - Ensure MongoDB is running on port 27019
2. **Port Conflicts** - Check if port 4000 is available
3. **Search Performance** - Monitor search query performance
4. **Contact Limits** - Verify contact count limits

### Debug Mode
```bash
DEBUG=contact:* npm start
```

### Health Checks
```http
GET /health              # Service health status
GET /health/db           # Database connectivity
GET /health/cache        # Cache system status
```

---

Part of the [MERN Chat Application](../README.md) microservices architecture.