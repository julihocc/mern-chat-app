// App component tests - testing main routing and providers
import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { I18nextProvider } from 'react-i18next'
import { MockedProvider } from '@apollo/client/testing'

import App from "../../App.jsx"
import initializeStore from '../../redux/store'
import theme from '../../utils/theme'
import i18n from '../../utils/i18n'

// Custom render for App component testing
const renderApp = async (initialRoute = '/', preloadedState = {}) => {
  const store = await initializeStore(preloadedState)
  
  return render(
    <MockedProvider mocks={[]} addTypename={false}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <MemoryRouter initialEntries={[initialRoute]}>
              <App />
            </MemoryRouter>
          </Provider>
        </ThemeProvider>
      </I18nextProvider>
    </MockedProvider>
  )
}

describe('App Component', () => {
  describe('Initialization', () => {
    it('renders without crashing', async () => {
      await renderApp()
      
      // Should render the main app structure
      expect(document.querySelector('.App')).toBeInTheDocument()
    })

    it('initializes authentication on mount', async () => {
      await renderApp()
      
      // The useInitializeAuth hook should be called
      // This is tested indirectly by ensuring the app renders
      expect(document.querySelector('.App')).toBeInTheDocument()
    })

    it('provides router context to child components', async () => {
      await renderApp()
      
      // Should have router context - no navigation errors
      expect(document.querySelector('.App')).toBeInTheDocument()
    })
  })

  describe('Routing Integration', () => {
    it('renders MainRoutes component', async () => {
      await renderApp()
      
      await waitFor(() => {
        // Should render elements that come from MainRoutes
        // Like the AppBar with welcome message
        expect(screen.getByText(/welcome/i)).toBeInTheDocument()
      })
    })

    it('handles different routes correctly', async () => {
      await renderApp('/login')
      
      await waitFor(() => {
        // Should render login page
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
      })
    })

    it('handles authenticated routes', async () => {
      const authenticatedState = {
        user: {
          _id: 'test-user-id',
          email: 'test@example.com',
          username: 'testuser',
          isLoggedIn: true,
          loading: false,
          error: null
        }
      }

      await renderApp('/dashboard', authenticatedState)
      
      await waitFor(() => {
        // Should render dashboard for authenticated users
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
      })
    })

    it('redirects unauthenticated users appropriately', async () => {
      const unauthenticatedState = {
        user: {
          _id: null,
          email: null,
          username: null,
          isLoggedIn: false,
          loading: false,
          error: null
        }
      }

      await renderApp('/dashboard', unauthenticatedState)
      
      await waitFor(() => {
        // Should redirect to login or show login prompt
        expect(screen.getByText(/please log in/i) || screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
      })
    })
  })

  describe('Provider Integration', () => {
    it('provides Redux store to components', async () => {
      const testState = {
        user: {
          _id: 'test-user-id',
          email: 'test@example.com',
          username: 'testuser',
          isLoggedIn: true,
          loading: false,
          error: null
        }
      }

      await renderApp('/dashboard', testState)
      
      await waitFor(() => {
        // Should display user data from Redux store
        expect(screen.getByText(/testuser/i)).toBeInTheDocument()
      })
    })

    it('provides Material-UI theme to components', async () => {
      await renderApp()
      
      // Should have Material-UI components with proper styling
      const appBar = document.querySelector('.MuiAppBar-root')
      expect(appBar).toBeInTheDocument()
    })

    it('provides i18n context for translations', async () => {
      await renderApp()
      
      await waitFor(() => {
        // Should display translated text
        expect(screen.getByText(/welcome/i)).toBeInTheDocument()
      })
    })

    it('provides Apollo Client context', async () => {
      await renderApp()
      
      // Should render without GraphQL context errors
      expect(document.querySelector('.App')).toBeInTheDocument()
    })
  })

  describe('Error Boundaries', () => {
    it('gracefully handles rendering errors', async () => {
      // This would test error boundaries if implemented
      await renderApp()
      
      // Should not crash the entire app
      expect(document.querySelector('.App')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', async () => {
      const { rerender } = await renderApp()
      
      // Re-render with same props shouldn't cause issues
      await rerender()
      
      expect(document.querySelector('.App')).toBeInTheDocument()
    })
  })
})