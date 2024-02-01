import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: [
      resolve(__dirname, 'tests/jest-setup.ts'),
      resolve(__dirname, 'tests/setup.ts')
    ],
  }
})
