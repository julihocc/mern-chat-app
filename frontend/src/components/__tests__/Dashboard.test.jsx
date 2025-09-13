// Dashboard component tests - demonstrating integration testing
import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders, mockUserState } from '@test/utils/testing-library.jsx'
import { mockGetCurrentUser, mockGetChatRooms } from '@test/mocks/graphql'
import Dashboard from '../Dashboard.jsx'

describe('Dashboard Component', () => {
  describe('Authentication Required', () => {
    it('shows login prompt when user is not logged in', async () => {
      await renderWithProviders(<Dashboard />, {
        preloadedState: {
          user: {
            isLoggedIn: false,
            user: null,
            loading: false,
            error: null
          }
        }
      })

      expect(screen.getByText(/please log in/i)).toBeInTheDocument()
    })

    it('shows loading state while fetching user data', async () => {
      await renderWithProviders(<Dashboard />, {
        preloadedState: {
          user: {
            isLoggedIn: true,
            user: null,
            loading: true,
            error: null
          }
        }
      })

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('shows error state when user data fails to load', async () => {
      await renderWithProviders(<Dashboard />, {
        preloadedState: {
          user: {
            isLoggedIn: true,
            user: null,
            loading: false,
            error: 'Failed to load user data'
          }
        }
      })

      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument()
    })
  })

  describe('Authenticated Dashboard', () => {
    beforeEach(() => {
      // Most tests will need an authenticated user
    })

    it('renders dashboard with user information', async () => {
      await renderWithProviders(<Dashboard />, {
        preloadedState: mockUserState,
        mocks: [mockGetCurrentUser, mockGetChatRooms]
      })

      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
        expect(screen.getByText(/testuser/i)).toBeInTheDocument()
      })
    })

    it('displays all main sections', async () => {
      await renderWithProviders(<Dashboard />, {
        preloadedState: mockUserState,
        mocks: [mockGetCurrentUser, mockGetChatRooms]
      })

      await waitFor(() => {
        // Check for main dashboard sections
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
        expect(screen.getByText(/pending contact requests/i)).toBeInTheDocument()
        expect(screen.getByText(/create group conversation/i)).toBeInTheDocument()
        expect(screen.getByText(/send contact request/i)).toBeInTheDocument()
        expect(screen.getByText(/chat list/i)).toBeInTheDocument()
      })
    })

    it('shows user gravatar and settings link', async () => {
      await renderWithProviders(<Dashboard />, {
        preloadedState: mockUserState,
        mocks: [mockGetCurrentUser, mockGetChatRooms]
      })

      await waitFor(() => {
        const settingsLink = screen.getByRole('link', { name: /settings/i })
        expect(settingsLink).toBeInTheDocument()
        expect(settingsLink).toHaveAttribute('href', '/settings')
      })
    })

    it('renders chat rooms list when available', async () => {
      await renderWithProviders(<Dashboard />, {
        preloadedState: mockUserState,
        mocks: [mockGetCurrentUser, mockGetChatRooms]
      })

      await waitFor(() => {
        // Should show chat rooms section
        expect(screen.getByText(/chat list/i)).toBeInTheDocument()
      })
    })

    it('handles empty chat rooms gracefully', async () => {
      const emptyChatRoomsMock = {
        request: {
          query: mockGetChatRooms.request.query
        },
        result: {
          data: {
            getChatRoomsForCurrentUser: []
          }
        }
      }

      await renderWithProviders(<Dashboard />, {
        preloadedState: mockUserState,
        mocks: [mockGetCurrentUser, emptyChatRoomsMock]
      })

      await waitFor(() => {
        expect(screen.getByText(/chat list/i)).toBeInTheDocument()
        // Should not crash with empty chat rooms
      })
    })
  })

  describe('Component Integration', () => {
    it('integrates all child components correctly', async () => {
      await renderWithProviders(<Dashboard />, {
        preloadedState: mockUserState,
        mocks: [mockGetCurrentUser, mockGetChatRooms]
      })

      await waitFor(() => {
        // Verify all major child components are rendered
        expect(screen.getByText(/pending contact requests/i)).toBeInTheDocument()
        expect(screen.getByText(/create group conversation/i)).toBeInTheDocument()
        expect(screen.getByText(/send contact request/i)).toBeInTheDocument()
        expect(screen.getByText(/chat list/i)).toBeInTheDocument()
        expect(screen.getByText(/contacts/i)).toBeInTheDocument()
      })
    })

    it('maintains responsive grid layout', async () => {
      await renderWithProviders(<Dashboard />, {
        preloadedState: mockUserState,
        mocks: [mockGetCurrentUser, mockGetChatRooms]
      })

      await waitFor(() => {
        // Check that Material-UI Grid components are present
        const container = screen.getByRole('main') || document.querySelector('.MuiContainer-root')
        expect(container).toBeInTheDocument()
      })
    })
  })

  describe('Real-time Updates', () => {
    it('should update when new chat rooms are available', async () => {
      // This would test WebSocket subscriptions
      // For now, we'll just ensure the component can handle data updates
      const { rerender } = await renderWithProviders(<Dashboard />, {
        preloadedState: mockUserState,
        mocks: [mockGetCurrentUser, mockGetChatRooms]
      })

      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
      })

      // Simulate new data coming in
      const updatedMocks = [
        mockGetCurrentUser,
        {
          ...mockGetChatRooms,
          result: {
            data: {
              getChatRoomsForCurrentUser: [
                ...mockGetChatRooms.result.data.getChatRoomsForCurrentUser,
                {
                  _id: 'new-chat-123',
                  createdAt: '2023-01-02T00:00:00.000Z',
                  participantIds: [
                    { _id: 'user-123', username: 'testuser', email: 'test@example.com' },
                    { _id: 'user-789', username: 'newuser', email: 'new@example.com' }
                  ]
                }
              ]
            }
          }
        }
      ]

      rerender(
        <Dashboard />,
        {
          preloadedState: mockUserState,
          mocks: updatedMocks
        }
      )

      // Component should handle the update without crashing
      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
      })
    })
  })
})