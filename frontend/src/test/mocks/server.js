// Mock Service Worker setup for API mocking
import { setupServer } from 'msw/node'
import { graphql, http, HttpResponse } from 'msw'

// Default GraphQL handlers for common queries/mutations
export const handlers = [
  // Mock getCurrentUser query
  graphql.query('GetCurrentUser', () => {
    return HttpResponse.json({
      data: {
        getCurrentUser: {
          _id: 'test-user-id',
          email: 'test@example.com',
          username: 'testuser',
          contacts: [],
        }
      }
    })
  }),

  // Mock login mutation
  graphql.mutation('Login', ({ variables }) => {
    const { email, password } = variables
    
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        data: {
          login: {
            user: {
              _id: 'test-user-id',
              email: 'test@example.com',
              username: 'testuser',
            },
            token: 'fake-jwt-token'
          }
        }
      })
    }

    return HttpResponse.json({
      errors: [{
        message: 'Invalid credentials'
      }]
    })
  }),

  // Mock signup mutation
  graphql.mutation('SignUp', ({ variables }) => {
    const { email, username, password } = variables
    
    return HttpResponse.json({
      data: {
        signUp: {
          user: {
            _id: 'new-user-id',
            email,
            username,
          },
          token: 'fake-jwt-token'
        }
      }
    })
  }),

  // Mock chat rooms query
  graphql.query('GetChatRoomsForCurrentUser', () => {
    return HttpResponse.json({
      data: {
        getChatRoomsForCurrentUser: [
          {
            _id: 'chat-1',
            createdAt: '2023-01-01T00:00:00.000Z',
            participantIds: [
              { _id: 'user-1', username: 'user1', email: 'user1@example.com' },
              { _id: 'user-2', username: 'user2', email: 'user2@example.com' }
            ]
          }
        ]
      }
    })
  }),

  // Mock messages query
  graphql.query('GetMessagesByChatRoomId', ({ variables }) => {
    const { chatRoomId } = variables
    
    return HttpResponse.json({
      data: {
        getMessagesByChatRoomId: [
          {
            _id: 'message-1',
            body: 'Hello world!',
            senderId: {
              _id: 'user-1',
              username: 'user1',
              email: 'user1@example.com'
            },
            createdAt: '2023-01-01T00:00:00.000Z',
            chatRoomId
          }
        ]
      }
    })
  }),

  // Catch-all for unhandled GraphQL operations
  graphql.operation(({ operationName }) => {
    console.warn(`Unhandled GraphQL operation: ${operationName}`)
    return HttpResponse.json({
      errors: [{
        message: `Unhandled operation: ${operationName}`
      }]
    })
  }),
]

// Create and export the server instance
export const server = setupServer(...handlers)