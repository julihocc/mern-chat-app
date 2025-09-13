# TDD Workflow Example - Adding a New Feature

This document demonstrates a complete TDD workflow for adding a new feature to the MERN Chat App.

## Feature: User Status Indicator

**Goal**: Add a user status indicator (online/offline) to the chat interface.

### Step 1: 🔴 Write the First Failing Test

```jsx
// src/components/__tests__/UserStatus.test.jsx
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@test/utils/testing-library'
import UserStatus from '../UserStatus.jsx'

describe('UserStatus Component', () => {
  it('should display online status when user is online', async () => {
    const mockUser = {
      _id: 'user-123',
      username: 'testuser',
      isOnline: true
    }

    await renderWithProviders(<UserStatus user={mockUser} />)
    
    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(screen.getByTestId('status-indicator')).toHaveClass('status-online')
  })
})
```

**Result**: ❌ Test fails (component doesn't exist)

### Step 2: 🟢 Write Minimal Implementation

```jsx
// src/components/UserStatus.jsx
import React from 'react'

const UserStatus = ({ user }) => {
  return (
    <div data-testid="status-indicator" className="status-online">
      Online
    </div>
  )
}

export default UserStatus
```

**Result**: ✅ Test passes (hardcoded implementation)

### Step 3: 🔴 Add More Test Cases

```jsx
// Add to UserStatus.test.jsx
it('should display offline status when user is offline', async () => {
  const mockUser = {
    _id: 'user-123',
    username: 'testuser',
    isOnline: false
  }

  await renderWithProviders(<UserStatus user={mockUser} />)
  
  expect(screen.getByText('Offline')).toBeInTheDocument()
  expect(screen.getByTestId('status-indicator')).toHaveClass('status-offline')
})

it('should show last seen when user is offline', async () => {
  const mockUser = {
    _id: 'user-123',
    username: 'testuser',
    isOnline: false,
    lastSeen: '2023-01-01T12:00:00.000Z'
  }

  await renderWithProviders(<UserStatus user={mockUser} />)
  
  expect(screen.getByText(/last seen/i)).toBeInTheDocument()
})
```

**Result**: ❌ New tests fail

### Step 4: 🟢 Implement Real Logic

```jsx
// src/components/UserStatus.jsx
import React from 'react'
import { formatDistanceToNow } from 'date-fns'

const UserStatus = ({ user }) => {
  const getStatusText = () => {
    if (user.isOnline) {
      return 'Online'
    }
    
    if (user.lastSeen) {
      return `Last seen ${formatDistanceToNow(new Date(user.lastSeen))} ago`
    }
    
    return 'Offline'
  }

  const getStatusClass = () => {
    return user.isOnline ? 'status-online' : 'status-offline'
  }

  return (
    <div data-testid="status-indicator" className={getStatusClass()}>
      {getStatusText()}
    </div>
  )
}

export default UserStatus
```

**Result**: ✅ All tests pass

### Step 5: 🔵 Refactor with Styling

```jsx
// src/components/UserStatus.jsx
import React from 'react'
import { Chip, Box } from '@mui/material'
import { FiberManualRecord } from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'

const UserStatus = ({ user }) => {
  const getStatusText = () => {
    if (user.isOnline) {
      return 'Online'
    }
    
    if (user.lastSeen) {
      return `Last seen ${formatDistanceToNow(new Date(user.lastSeen))} ago`
    }
    
    return 'Offline'
  }

  return (
    <Box data-testid="status-indicator">
      <Chip
        icon={<FiberManualRecord />}
        label={getStatusText()}
        color={user.isOnline ? 'success' : 'default'}
        variant="outlined"
        size="small"
        sx={{
          '& .MuiChip-icon': {
            color: user.isOnline ? 'success.main' : 'grey.400'
          }
        }}
      />
    </Box>
  )
}

export default UserStatus
```

### Step 6: 🔴 Add Integration Test

```jsx
// src/components/__tests__/ChatRoomViewer.test.jsx (add to existing file)
describe('User Status Integration', () => {
  it('should show user status in message list', async () => {
    const mockMessages = [
      {
        _id: 'msg-1',
        body: 'Hello',
        senderId: {
          _id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          isOnline: true
        }
      }
    ]

    await renderWithProviders(<ChatRoomViewer />, {
      mocks: [
        createMockQuery(GET_MESSAGES, { chatRoomId: 'chat-123' }, {
          getMessagesByChatRoomId: mockMessages
        })
      ]
    })

    await waitFor(() => {
      expect(screen.getByText('Online')).toBeInTheDocument()
    })
  })
})
```

### Step 7: 🟢 Update Chat Components

```jsx
// src/components/ChatRoomViewer.jsx (modify existing)
import UserStatus from './UserStatus.jsx'

// In the message rendering section:
<ListItem>
  <ListItemAvatar>
    <Gravatar email={message.senderId.email} />
  </ListItemAvatar>
  <ListItemText
    primary={
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2">{message.body}</Typography>
        <UserStatus user={message.senderId} />
      </Box>
    }
    secondary={message.senderId.username}
  />
</ListItem>
```

### Step 8: 🔴 Add Real-time Updates

```jsx
// Add subscription test
it('should update status in real-time', async () => {
  const mockSubscription = {
    request: {
      query: USER_STATUS_SUBSCRIPTION,
      variables: { userId: 'user-123' }
    },
    result: {
      data: {
        userStatusChanged: {
          userId: 'user-123',
          isOnline: false,
          lastSeen: '2023-01-01T12:00:00.000Z'
        }
      }
    }
  }

  await renderWithProviders(<UserStatus user={mockUser} />, {
    mocks: [mockSubscription]
  })

  // Initial state
  expect(screen.getByText('Online')).toBeInTheDocument()

  // After subscription update
  await waitFor(() => {
    expect(screen.getByText(/last seen/i)).toBeInTheDocument()
  })
})
```

### Step 9: 🟢 Implement Subscription

```jsx
// src/hooks/useUserStatus.js
import { useSubscription } from '@apollo/client'
import { USER_STATUS_SUBSCRIPTION } from '../gql/subscriptions'

export const useUserStatus = (userId) => {
  const { data } = useSubscription(USER_STATUS_SUBSCRIPTION, {
    variables: { userId }
  })

  return data?.userStatusChanged
}
```

### Step 10: 🔵 Final Refactor and Documentation

```jsx
// src/components/UserStatus.jsx - Final version
import React from 'react'
import { Chip, Box } from '@mui/material'
import { FiberManualRecord } from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'
import { useUserStatus } from '../hooks/useUserStatus'

/**
 * UserStatus Component
 * 
 * Displays real-time user online/offline status with last seen information.
 * Updates automatically via GraphQL subscriptions.
 * 
 * @param {Object} user - User object with status information
 * @param {string} user._id - User ID
 * @param {boolean} user.isOnline - Current online status
 * @param {string} user.lastSeen - ISO timestamp of last activity
 */
const UserStatus = ({ user }) => {
  // Subscribe to real-time status updates
  const statusUpdate = useUserStatus(user._id)
  
  // Use subscription data if available, fallback to props
  const currentStatus = statusUpdate || user

  const getStatusText = () => {
    if (currentStatus.isOnline) {
      return 'Online'
    }
    
    if (currentStatus.lastSeen) {
      return `Last seen ${formatDistanceToNow(new Date(currentStatus.lastSeen))} ago`
    }
    
    return 'Offline'
  }

  return (
    <Box data-testid="status-indicator">
      <Chip
        icon={<FiberManualRecord />}
        label={getStatusText()}
        color={currentStatus.isOnline ? 'success' : 'default'}
        variant="outlined"
        size="small"
        sx={{
          '& .MuiChip-icon': {
            color: currentStatus.isOnline ? 'success.main' : 'grey.400'
          }
        }}
      />
    </Box>
  )
}

export default UserStatus
```

## TDD Benefits Demonstrated

1. **🎯 Clear Requirements**: Tests define exactly what the component should do
2. **🔒 Safety Net**: Refactoring is safe with comprehensive test coverage  
3. **📚 Living Documentation**: Tests serve as examples of how to use the component
4. **🚀 Confidence**: Each step is validated before moving forward
5. **🧩 Modularity**: TDD naturally leads to well-structured, testable code

## Final Test Suite

```bash
npm run test:coverage

# Results:
# UserStatus.jsx        | 100% | 100% | 100% | 100%
# useUserStatus.js      | 100% | 100% | 100% | 100%
# ChatRoomViewer.jsx    |  95% |  90% |  95% |  95%
```

The feature is now complete with:
- ✅ Full test coverage
- ✅ Real-time updates
- ✅ Clean, maintainable code
- ✅ Proper documentation
- ✅ Integration with existing components

This demonstrates how TDD leads to better design, higher confidence, and maintainable code.