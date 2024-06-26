import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pathResolve = (pathname: string) => resolve(__dirname, '.', pathname)

export default defineConfig({
  resolve: {
    alias: {
      '@rcuse/core': pathResolve('../core/index.ts'),
      '@rcuse/shared': pathResolve('../shared/index.ts'),
    },
  },
})
