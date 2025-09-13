// Login component tests - demonstrating TDD approach
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, waitFor, userEvent } from '@testing-library/react'
import { renderWithProviders } from '@test/utils/testing-library.jsx'
import { mockLoginSuccess, mockLoginError } from '@test/mocks/graphql'
import Login from '../Login.jsx'

describe('Login Component', () => {
  beforeEach(() => {
    // Clear any previous mocks
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders login form with required fields', async () => {
      await renderWithProviders(<Login />)
      
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('has proper input types for security', async () => {
      await renderWithProviders(<Login />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('Form Validation', () => {
    it('shows error for invalid email format', async () => {
      await renderWithProviders(<Login />)
      
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
      })
    })

    it('shows error when fields are empty', async () => {
      await renderWithProviders(<Login />)
      
      const user = userEvent.setup()
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/both fields required/i)).toBeInTheDocument()
      })
    })

    it('clears error messages when user starts typing', async () => {
      await renderWithProviders(<Login />)
      
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      // Trigger an error first
      await user.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/both fields required/i)).toBeInTheDocument()
      })

      // Start typing - error should clear
      await user.type(emailInput, 't')
      expect(screen.queryByText(/both fields required/i)).not.toBeInTheDocument()
    })
  })

  describe('Authentication Flow', () => {
    it('successfully logs in with valid credentials', async () => {
      const { store } = await renderWithProviders(<Login />, {
        mocks: [mockLoginSuccess]
      })
      
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password')
      await user.click(submitButton)

      // Wait for Apollo mutation to complete
      await waitFor(() => {
        const state = store.getState()
        expect(state.user.isLoggedIn).toBe(true)
        expect(state.user.email).toBe('test@example.com')
      })
    })

    it('shows error message for invalid credentials', async () => {
      await renderWithProviders(<Login />, {
        mocks: [mockLoginError]
      })
      
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(emailInput, 'wrong@example.com')
      await user.type(passwordInput, 'wrongpass')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })

    it('shows loading state during authentication', async () => {
      const slowMock = {
        ...mockLoginSuccess,
        delay: 1000 // Simulate slow network
      }

      await renderWithProviders(<Login />, {
        mocks: [slowMock]
      })
      
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password')
      await user.click(submitButton)

      // Should show loading state
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('redirects to dashboard after successful login', async () => {
      // This test would require mocking useNavigate from react-router-dom
      // For now, we'll test that the navigation logic is called
      const mockNavigate = vi.fn()
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom')
        return {
          ...actual,
          useNavigate: () => mockNavigate
        }
      })

      await renderWithProviders(<Login />, {
        mocks: [mockLoginSuccess]
      })
      
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', async () => {
      await renderWithProviders(<Login />)
      
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      
      expect(emailInput).toHaveAccessibleName()
      expect(passwordInput).toHaveAccessibleName()
    })

    it('supports keyboard navigation', async () => {
      await renderWithProviders(<Login />)
      
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      // Tab navigation should work
      await user.tab()
      expect(emailInput).toHaveFocus()
      
      await user.tab()
      expect(passwordInput).toHaveFocus()
      
      await user.tab()
      expect(submitButton).toHaveFocus()
    })
  })
})