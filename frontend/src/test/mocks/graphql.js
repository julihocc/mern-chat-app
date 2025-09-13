// GraphQL query and mutation mocks for testing
import { gql } from '@apollo/client'

// Login mutation mock
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        _id
        email
        username
      }
      token
    }
  }
`

// SignUp mutation mock
export const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $username: String!, $password: String!, $confirmPassword: String!) {
    signUp(email: $email, username: $username, password: $password, confirmPassword: $confirmPassword) {
      user {
        _id
        email
        username
      }
      token
    }
  }
`

// Get current user query mock
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      _id
      email
      username
      contacts {
        _id
        email
        username
      }
    }
  }
`

// Get chat rooms query mock
export const GET_CHAT_ROOMS = gql`
  query GetChatRoomsForCurrentUser {
    getChatRoomsForCurrentUser {
      _id
      createdAt
      participantIds {
        _id
        username
        email
      }
    }
  }
`

// Get messages query mock
export const GET_MESSAGES = gql`
  query GetMessagesByChatRoomId($chatRoomId: ID!) {
    getMessagesByChatRoomId(chatRoomId: $chatRoomId) {
      _id
      body
      senderId {
        _id
        username
        email
      }
      createdAt
      chatRoomId
    }
  }
`

// Send message mutation mock
export const SEND_MESSAGE = gql`
  mutation SendMessage($chatRoomId: ID!, $body: String!, $file: String) {
    sendMessage(chatRoomId: $chatRoomId, body: $body, file: $file) {
      _id
      body
      senderId {
        _id
        username
        email
      }
      createdAt
      chatRoomId
    }
  }
`

// Mock data for testing
export const mockUser = {
  _id: 'user-123',
  email: 'test@example.com',
  username: 'testuser',
  contacts: []
}

export const mockChatRoom = {
  _id: 'chat-123',
  createdAt: '2023-01-01T00:00:00.000Z',
  participantIds: [
    { _id: 'user-123', username: 'testuser', email: 'test@example.com' },
    { _id: 'user-456', username: 'otheruser', email: 'other@example.com' }
  ]
}

export const mockMessage = {
  _id: 'message-123',
  body: 'Test message',
  senderId: {
    _id: 'user-123',
    username: 'testuser',
    email: 'test@example.com'
  },
  createdAt: '2023-01-01T00:00:00.000Z',
  chatRoomId: 'chat-123'
}

// Common mock responses
export const mockLoginSuccess = {
  request: {
    query: LOGIN_MUTATION,
    variables: { email: 'test@example.com', password: 'password' }
  },
  result: {
    data: {
      login: {
        user: mockUser,
        token: 'fake-jwt-token'
      }
    }
  }
}

export const mockLoginError = {
  request: {
    query: LOGIN_MUTATION,
    variables: { email: 'wrong@example.com', password: 'wrongpass' }
  },
  error: new Error('Invalid credentials')
}

export const mockGetCurrentUser = {
  request: {
    query: GET_CURRENT_USER
  },
  result: {
    data: {
      getCurrentUser: mockUser
    }
  }
}

export const mockGetChatRooms = {
  request: {
    query: GET_CHAT_ROOMS
  },
  result: {
    data: {
      getChatRoomsForCurrentUser: [mockChatRoom]
    }
  }
}

export const mockGetMessages = {
  request: {
    query: GET_MESSAGES,
    variables: { chatRoomId: 'chat-123' }
  },
  result: {
    data: {
      getMessagesByChatRoomId: [mockMessage]
    }
  }
}