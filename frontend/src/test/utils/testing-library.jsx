// Apollo Client testing utilities
import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { I18nextProvider } from 'react-i18next'
import { vi } from 'vitest'

// Import your app's dependencies
import initializeStore from '../../redux/store'
import theme from '../../utils/theme'
import i18n from '../../utils/i18n'

/**
 * Creates a mock Apollo Client with predefined mocks
 * @param {Array} mocks - Array of GraphQL mocks
 * @param {Object} options - Additional options for MockedProvider
 */
export const createMockApolloClient = (mocks = [], options = {}) => {
  return {
    mocks,
    addTypename: false,
    defaultOptions: {
      query: { errorPolicy: 'all' },
      watchQuery: { errorPolicy: 'all' }
    },
    ...options
  }
}

/**
 * Enhanced render function with all providers for component testing
 * @param {ReactElement} ui - Component to render
 * @param {Object} options - Render options
 */
export const renderWithProviders = async (
  ui, 
  {
    preloadedState = {},
    store = await initializeStore(preloadedState),
    mocks = [],
    apolloOptions = {},
    ...renderOptions
  } = {}
) => {
  const apolloProps = createMockApolloClient(mocks, apolloOptions)
  
  function Wrapper({ children }) {
    return (
      <MockedProvider {...apolloProps}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <BrowserRouter>
                {children}
              </BrowserRouter>
            </Provider>
          </ThemeProvider>
        </I18nextProvider>
      </MockedProvider>
    )
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}

/**
 * Create mock GraphQL queries/mutations for testing
 */
export const createMockQuery = (query, variables = {}, result = {}, error = null) => {
  return {
    request: {
      query,
      variables,
    },
    result: error ? { errors: [error] } : { data: result },
    ...(error && { error }),
  }
}

/**
 * Create mock mutation with loading and error states
 */
export const createMockMutation = (mutation, variables = {}, result = {}, error = null, loading = false) => {
  const mock = createMockQuery(mutation, variables, result, error)
  
  if (loading) {
    mock.delay = 1000 // Simulate loading state
  }
  
  return mock
}

/**
 * Mock Redux user state for testing
 */
export const mockUserState = {
  user: {
    _id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    isLoggedIn: true,
    loading: false,
    error: null,
  }
}

/**
 * Mock Redux initial state for testing
 */
export const mockInitialState = {
  user: {
    _id: null,
    email: null,
    username: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  }
}

/**
 * Helper to mock localStorage for testing
 */
export const mockLocalStorage = (() => {
  let store = {}
  
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value)
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index) => Object.keys(store)[index] || null)
  }
})()

/**
 * Helper to wait for Apollo Client operations to complete
 */
export const waitForApollo = () => new Promise(resolve => setTimeout(resolve, 0))

/**
 * Mock console methods for cleaner test output
 */
export const mockConsole = () => {
  const originalConsole = { ...console }
  
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })
  
  return originalConsole
}

// Re-export testing utilities for convenience
export { vi } from 'vitest'
export { screen, fireEvent, waitFor, act } from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'