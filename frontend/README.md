# Frontend - React Application

[![Version](https://img.shields.io/badge/version-v0.2.0-blue)](https://github.com/julihocc/mern-chat-app)
[![React](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-4.4.5-purple)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/vitest-3.2.4-green)](https://vitest.dev/)

Modern React frontend for the MERN Chat Application, built with Vite and comprehensive TDD setup.

## ⚛️ Overview

The Frontend is a modern React application that provides the user interface for the chat application. It connects to the GraphQL Gateway and provides real-time messaging, user management, and contact features. Built with **Vite** for fast development and optimized production builds.

## 📋 Features

- **Modern React 18** - Latest React features with concurrent rendering
- **Vite Build System** - Fast development server and optimized builds
- **Apollo Client** - GraphQL client with caching and real-time subscriptions
- **Material-UI** - Modern design system with responsive components
- **Redux Toolkit** - Predictable state management
- **React Router** - Client-side routing and navigation
- **Internationalization** - Multi-language support with React i18next
- **Test-Driven Development** - Comprehensive testing with Vitest and React Testing Library
- **Real-time Updates** - WebSocket subscriptions for live messaging

## 🏗️ Architecture

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── __tests__/       # Component tests
│   │   ├── Chat/            # Chat-related components
│   │   ├── Auth/            # Authentication components
│   │   └── Common/          # Shared components
│   ├── hooks/               # Custom React hooks
│   ├── redux/              # Redux store and slices
│   │   ├── store.js        # Store configuration
│   │   └── slices/         # Feature-based slices
│   ├── utils/              # Utility functions
│   │   ├── theme.js        # Material-UI theme
│   │   └── i18n.js         # Internationalization
│   ├── gql/                # GraphQL queries and mutations
│   ├── test/               # Testing infrastructure
│   │   ├── setup.js        # Test environment setup
│   │   ├── mocks/          # Mock data and services
│   │   └── utils/          # Testing utilities
│   ├── apolloClient.js     # Apollo Client configuration
│   ├── App.jsx             # Root component
│   └── index.js           # Application entry point
├── vitest.config.js        # Test configuration
├── vite.config.js          # Vite configuration
├── TESTING.md              # Testing documentation
├── TDD_EXAMPLE.md          # TDD workflow guide
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Gateway service running on port 3001

### Local Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```bash
# Required
VITE_GRAPHQL_URI=http://localhost:3001/graphql
VITE_GRAPHQL_WS_URI=ws://localhost:3001/graphql

# Optional
VITE_APP_NAME=MERN Chat App     # Default: MERN Chat App
VITE_APP_VERSION=0.2.0          # Default: 0.2.0
VITE_LOG_LEVEL=info             # Default: info
```

## 🧪 Testing & TDD

### Testing Stack
- **[Vitest](https://vitest.dev/)** - Fast, Vite-native testing framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing utilities
- **[MSW](https://mswjs.io/)** - Mock Service Worker for API mocking
- **[jsdom](https://github.com/jsdom/jsdom)** - Browser environment simulation

### Running Tests
```bash
# Run all tests once
npm test
npm run test:run

# Watch mode for TDD
npm run test:watch

# Coverage report
npm run test:coverage

# Visual UI interface
npm run test:ui

# Using convenience script
./test.sh           # Run all tests
./test.sh watch     # Watch mode
./test.sh coverage  # With coverage
./test.sh ui        # Visual interface
```

### TDD Workflow
1. **🔴 Red Phase** - Write failing test
2. **🟢 Green Phase** - Write minimal code to pass
3. **🔵 Refactor Phase** - Improve code quality

### Example Test Structure
```jsx
// Component test example
import { describe, it, expect } from 'vitest'
import { screen, userEvent } from '@testing-library/react'
import { renderWithProviders } from '@test/utils/testing-library'
import LoginForm from '../LoginForm.jsx'

describe('LoginForm', () => {
  it('should handle successful login', async () => {
    const { store } = await renderWithProviders(<LoginForm />, {
      mocks: [loginSuccessMock]
    })
    
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(store.getState().user.isLoggedIn).toBe(true)
    })
  })
})
```

## 📱 Key Components

### Authentication
```jsx
// Login component with form validation
<LoginForm onSuccess={() => navigate('/dashboard')} />

// Protected route wrapper
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### Real-time Messaging
```jsx
// Chat room with live messages
<ChatRoom 
  roomId={roomId}
  onSendMessage={handleSendMessage}
/>

// Message list with subscriptions
<MessageList 
  messages={messages}
  loading={loading}
  onLoadMore={loadMore}
/>
```

### State Management
```jsx
// Redux slice for user state
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
    },
    loginSuccess: (state, action) => {
      state.user = action.payload
      state.isLoggedIn = true
      state.loading = false
    }
  }
})
```

## 🎨 UI/UX Features

### Material-UI Integration
```jsx
// Custom theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})
```

### Responsive Design
- **Mobile-first** approach with Material-UI breakpoints
- **Adaptive layouts** for different screen sizes
- **Touch-friendly** interface elements
- **Accessible** components with proper ARIA labels

### Dark Mode Support
```jsx
// Theme toggle implementation
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)
  
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  })
  
  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  )
}
```

## 🌐 GraphQL Integration

### Apollo Client Setup
```jsx
// Client configuration with auth and subscriptions
const client = new ApolloClient({
  link: split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  ),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
  },
})
```

### Query Examples
```jsx
// Get current user
const { data, loading, error } = useQuery(GET_CURRENT_USER)

// Send message mutation
const [sendMessage] = useMutation(SEND_MESSAGE, {
  update(cache, { data: { sendMessage } }) {
    // Update cache with new message
  }
})

// Subscribe to new messages
const { data } = useSubscription(MESSAGE_ADDED, {
  variables: { chatRoomId }
})
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Route-level access control
- **Input Validation** - Client-side form validation
- **XSS Prevention** - Sanitized user inputs
- **CSRF Protection** - Cross-site request forgery prevention

## 📈 Performance Optimizations

### Code Splitting
```jsx
// Lazy loading for routes
const Dashboard = lazy(() => import('./components/Dashboard'))
const ChatRoom = lazy(() => import('./components/ChatRoom'))

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/chat/:id" element={<ChatRoom />} />
  </Routes>
</Suspense>
```

### Memoization
```jsx
// Expensive component optimization
const ExpensiveComponent = memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data)
  }, [data])
  
  const handleAction = useCallback((id) => {
    onAction(id)
  }, [onAction])
  
  return <div>{processedData}</div>
})
```

## 🌍 Internationalization

### Language Support
```jsx
// i18n configuration
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      fr: { translation: frTranslations },
    },
    lng: 'en',
    fallbackLng: 'en',
  })

// Usage in components
const { t } = useTranslation()
return <h1>{t('welcome_message')}</h1>
```

## 🐳 Docker & Deployment

### Development Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### Production Docker
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 Analytics & Monitoring

### Performance Monitoring
```jsx
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### Error Boundary
```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

## 🔧 Development Tools

### VS Code Configuration
```json
// .vscode/settings.json
{
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Recommended Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## 🚀 Future Enhancements

- [ ] **Progressive Web App** - PWA capabilities for mobile
- [ ] **Push Notifications** - Real-time notification system
- [ ] **Voice Messages** - Audio message recording and playback
- [ ] **File Sharing** - Drag-and-drop file uploads
- [ ] **Emoji Reactions** - Message reaction system
- [ ] **Thread Replies** - Threaded conversation support
- [ ] **Advanced Search** - Full-text message search
- [ ] **Keyboard Shortcuts** - Power user keyboard navigation

## 📖 Documentation

- 📋 **[Testing Guide](./TESTING.md)** - Comprehensive testing documentation
- 🎯 **[TDD Workflow](./TDD_EXAMPLE.md)** - Complete TDD example with UserStatus component
- 🏗️ **[Architecture Guide](../README.md)** - Overall application architecture
- 🔧 **Component Documentation** - Individual component documentation

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors** - Check Node.js version compatibility
2. **GraphQL Errors** - Verify Gateway service is running
3. **Test Failures** - Ensure all dependencies are installed
4. **Hot Reload Issues** - Restart Vite dev server

### Debug Mode
```bash
# Enable debug logging
VITE_LOG_LEVEL=debug npm run dev

# Run tests with verbose output
npm run test:run -- --reporter=verbose
```

---

Part of the [MERN Chat Application](../README.md) microservices architecture.