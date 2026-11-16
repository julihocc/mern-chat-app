import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `define.global` rewrites the identifier inside import specifiers, so
// Apollo's `./global.js` becomes `./globalThis.js`. Point that back at the file.
function keepGlobalFilename() {
  return {
    name: 'keep-global-filename',
    resolveId(source, importer) {
      if (!importer || source !== './globalThis.js') return null
      const rewritten = resolve(dirname(importer), source)
      const original = resolve(dirname(importer), 'global.js')
      if (!existsSync(rewritten) && existsSync(original)) return original
      return null
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    keepGlobalFilename(),
    react({
      include: "**/*.{jsx,tsx,js,ts}",
    })
  ],
  optimizeDeps: {
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