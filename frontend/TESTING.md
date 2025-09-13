# Testing Guide - MERN Chat App Frontend

## 🧪 Testing Setup

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing. The setup is optimized for Test-Driven Development (TDD) workflows.

### Testing Stack

- **[Vitest](https://vitest.dev/)** - Fast unit test framework (Vite-native)
- **[React Testing Library](https://testing-library.com/react)** - Simple and complete testing utilities
- **[MSW (Mock Service Worker)](https://mswjs.io/)** - API mocking for GraphQL/REST
- **[Apollo Client Testing](https://www.apollographql.com/docs/react/development-testing/)** - GraphQL query/mutation testing
- **[jsdom](https://github.com/jsdom/jsdom)** - DOM environment for Node.js testing

## 🚀 Getting Started

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Open Vitest UI (visual test runner)
npm run test:ui

# Using the helper script
./test.sh          # Run all tests
./test.sh watch    # Watch mode
./test.sh coverage # With coverage
./test.sh ui       # Visual interface
```

### File Structure

```
frontend/src/
├── test/                          # Testing configuration
│   ├── setup.js                   # Test environment setup
│   ├── mocks/                     # Mock definitions
│   │   ├── server.js              # MSW server setup
│   │   └── graphql.js             # GraphQL mocks
│   └── utils/                     # Testing utilities
│       └── testing-library.js     # Custom render functions
├── components/
│   ├── __tests__/                 # Component tests
│   │   ├── Login.test.jsx
│   │   ├── Dashboard.test.jsx
│   │   └── App.test.jsx
│   └── Component.jsx
└── hooks/
    └── __tests__/                 # Hook tests
        └── useAuth.test.js
```

## 📋 Testing Patterns

### 1. Component Testing

```jsx
import { describe, it, expect } from 'vitest'
import { screen, userEvent } from '@testing-library/react'
import { renderWithProviders } from '@test/utils/testing-library'
import MyComponent from '../MyComponent.jsx'

describe('MyComponent', () => {
  it('renders correctly', async () => {
    await renderWithProviders(<MyComponent />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### 2. GraphQL Testing

```jsx
import { mockLoginSuccess } from '@test/mocks/graphql'

describe('Login Component', () => {
  it('handles successful login', async () => {
    await renderWithProviders(<Login />, {
      mocks: [mockLoginSuccess]
    })
    
    // Test GraphQL interaction
  })
})
```

### 3. Redux Testing

```jsx
import { mockUserState } from '@test/utils/testing-library'

describe('Dashboard', () => {
  it('shows user data from store', async () => {
    await renderWithProviders(<Dashboard />, {
      preloadedState: mockUserState
    })
    
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })
})
```

### 4. Hook Testing

```jsx
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'

describe('useAuth Hook', () => {
  it('handles authentication state', () => {
    const { result } = renderHook(() => useAuth())
    
    act(() => {
      result.current.login('email', 'password')
    })
    
    expect(result.current.isLoggedIn).toBe(true)
  })
})
```

## 🎯 Test-Driven Development (TDD) Workflow

### Red-Green-Refactor Cycle

1. **🔴 Red**: Write a failing test
2. **🟢 Green**: Write minimal code to pass
3. **🔵 Refactor**: Improve code quality

### Example TDD Flow

```bash
# 1. Start with watch mode
npm run test:watch

# 2. Create a failing test
# src/components/__tests__/NewFeature.test.jsx

# 3. Watch it fail (RED)
# 4. Write minimal implementation (GREEN)  
# 5. Refactor for better design (REFACTOR)
# 6. Repeat for next feature
```

### TDD Best Practices

- **Start with the simplest test case**
- **Write descriptive test names** that explain the behavior
- **Test one behavior per test**
- **Use AAA pattern**: Arrange, Act, Assert
- **Mock external dependencies**
- **Test user interactions, not implementation details**

## 🧩 Testing Utilities

### Custom Render Function

```jsx
import { renderWithProviders } from '@test/utils/testing-library'

// Renders component with all necessary providers
const { store, ...utils } = await renderWithProviders(<Component />, {
  preloadedState: { user: mockUser },
  mocks: [mockQuery],
  apolloOptions: { errorPolicy: 'all' }
})
```

### GraphQL Mocking

```jsx
import { createMockQuery, createMockMutation } from '@test/utils/testing-library'

const loginMock = createMockMutation(
  LOGIN_MUTATION,
  { email: 'test@example.com', password: 'password' },
  { login: { user: mockUser, token: 'fake-token' } }
)
```

### Mock Service Worker (MSW)

```jsx
// Override default mocks for specific tests
import { server } from '@test/mocks/server'
import { graphql, HttpResponse } from 'msw'

// In your test
server.use(
  graphql.query('GetCurrentUser', () => {
    return HttpResponse.json({
      data: { getCurrentUser: customUser }
    })
  })
)
```

## 📊 Coverage Guidelines

### Coverage Targets

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

### Coverage Best Practices

- **Focus on critical paths** (authentication, data mutations)
- **Don't chase 100% coverage** - focus on meaningful tests
- **Exclude configuration files** from coverage
- **Test edge cases** and error conditions
- **Prioritize complex business logic**

## 🎨 Writing Good Tests

### Test Naming Convention

```jsx
describe('ComponentName', () => {
  describe('Feature/Behavior Group', () => {
    it('should do something when condition is met', () => {
      // Test implementation
    })
  })
})
```

### AAA Pattern

```jsx
it('should update username when form is submitted', async () => {
  // Arrange
  await renderWithProviders(<UserProfile />, { mocks: [updateUserMock] })
  const user = userEvent.setup()
  
  // Act
  await user.type(screen.getByLabelText(/username/i), 'newname')
  await user.click(screen.getByRole('button', { name: /save/i }))
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText('Profile updated')).toBeInTheDocument()
  })
})
```

### Async Testing

```jsx
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// Use userEvent for interactions
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'text')
```

## 🚨 Common Pitfalls

### ❌ Don't Test Implementation Details

```jsx
// BAD - testing internal state
expect(component.state.count).toBe(1)

// GOOD - testing user-visible behavior  
expect(screen.getByText('Count: 1')).toBeInTheDocument()
```

### ❌ Don't Use getBy* for Non-Existent Elements

```jsx
// BAD - will throw error
expect(screen.getByText('Not there')).not.toBeInTheDocument()

// GOOD - use queryBy* for elements that might not exist
expect(screen.queryByText('Not there')).not.toBeInTheDocument()
```

### ❌ Don't Forget to Clean Up

```jsx
// Use afterEach in setup.js for global cleanup
afterEach(() => {
  cleanup() // React Testing Library cleanup
  server.resetHandlers() // MSW cleanup
})
```

## 🔧 Debugging Tests

### VS Code Configuration

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run", "--reporter=verbose"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Debug Commands

```bash
# Run specific test file
npm test -- Login.test.jsx

# Run tests matching pattern
npm test -- --grep "authentication"

# Debug with console output
npm test -- --reporter=verbose

# Run single test and stop on failure
npm test -- --bail=1
```

### Debugging Tips

- Use `screen.debug()` to see current DOM
- Use `screen.logTestingPlaygroundURL()` for query suggestions
- Add `console.log` in test files (they'll show in output)
- Use Vitest UI for visual debugging

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/)
- [Apollo Testing Guide](https://www.apollographql.com/docs/react/development-testing/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing

When adding new features:

1. **Write tests first** (TDD approach)
2. **Update mocks** if adding new GraphQL operations
3. **Maintain coverage** above minimum thresholds
4. **Add integration tests** for user workflows
5. **Update this documentation** when adding new patterns

---

Happy Testing! 🎉