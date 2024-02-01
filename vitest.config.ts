import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@rcuse/shared': resolve(__dirname, 'packages/shared/index.ts'),
      '@rcuse/core': resolve(__dirname, 'packages/core/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: [
      resolve(__dirname, 'tests/jest-setup.ts'),
      resolve(__dirname, 'tests/setup.ts')
    ],
  }
})
