import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,tsx,js,ts}",
    })
  ],
  test: {
    // Use jsdom environment for React component testing
    environment: 'jsdom',
    
    // Setup file to configure testing environment
    setupFiles: ['./src/test/setup.js'],
    
    // Global test configuration
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.js',
        'build/',
        'public/'
      ]
    },
    
    // Include patterns for test files
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache'
    ],
    
    // Test timeout
    testTimeout: 10000,
    
    // Mock CSS imports and other assets
    css: false,
    
    // Define alias for cleaner imports in tests
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@test': '/src/test'
    }
  },
  
  // Reuse the same esbuild configuration from main vite config
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
  },
})