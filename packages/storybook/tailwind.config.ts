import animate from 'tailwindcss-animate'
import type { Config } from 'tailwindcss'

export default {
  content: [
    './stories/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
    },
  },
  plugins: [
    animate,
  ],
} satisfies Config
