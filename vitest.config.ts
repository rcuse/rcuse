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
      resolve(__dirname, 'packages/.test/setup.ts')
    ],
    reporters: 'dot',
  }
})
