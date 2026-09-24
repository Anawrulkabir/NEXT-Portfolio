import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        showcase: ['var(--font-showcase)', 'Georgia', 'serif'],
        hand: ['var(--font-hand)', 'cursive'],
      },
    },
  },
}

export default config
