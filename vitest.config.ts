import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./client/src/tests/setup.ts']
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './shared')
    }
  }
})