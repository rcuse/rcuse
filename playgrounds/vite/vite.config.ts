import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: command === 'build'
    ? {}
    : {
        alias: {
          '@rcuse/core': resolve(__dirname, '../../packages/core/index.ts'),
          '@rcuse/shared': resolve(__dirname, '../../packages/shared/index.ts'),
          '@rcuse/integrations': resolve(__dirname, '../../packages/integrations/index.ts'),
        },
      },
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@rcuse/'))
            return 'rcuse'
          else
            return 'vendor'
        },
      },
    },
  },
}))
