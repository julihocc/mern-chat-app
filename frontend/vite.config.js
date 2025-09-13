import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,tsx,js,ts}",
    })
  ],
  esbuild: {
    include: /\.(tsx?|jsx?)$/,
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
    exclude: ['@apollo/client'],
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true,
      },
      // Proxy for auth service direct calls if any
      '/api/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Proxy for chat service direct calls if any
      '/api/chat': {
        target: 'http://localhost:4500',
        changeOrigin: true,
      },
      // Proxy for contact service direct calls if any
      '/api/contact': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      external: [],
    },
  },
  define: {
    // For compatibility with some packages that expect process.env
    global: 'globalThis',
  }
})