import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Design-system tokens — see docs/PORTFOLIO_REDESIGN.md §08.1
        night: 'rgb(var(--night-rgb) / <alpha-value>)',
        slate: 'rgb(var(--slate-rgb) / <alpha-value>)',
        moss: 'rgb(var(--moss-rgb) / <alpha-value>)',
        fern: 'rgb(var(--fern-rgb) / <alpha-value>)',
        loam: 'rgb(var(--loam-rgb) / <alpha-value>)',
        parchment: 'rgb(var(--parchment-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        signal: 'rgb(var(--signal-rgb) / <alpha-value>)',
        amber: 'rgb(var(--amber-rgb) / <alpha-value>)',
        ember: 'rgb(var(--ember-rgb) / <alpha-value>)',
        'zone-workshop': 'var(--zone-workshop)',
        'zone-dungeon': 'var(--zone-dungeon)',
        'zone-garage': 'var(--zone-garage)',
        'zone-software': 'var(--zone-software)',
        'zone-datacenter': 'var(--zone-datacenter)',
        'zone-physics-lab': 'var(--zone-physics-lab)',
        'zone-thermal-lab': 'var(--zone-thermal-lab)',

        // Legacy shadcn tokens — still used by ui/{sheet,button,card,carousel}
        // until they're rebuilt/removed in later phases (see §01.1, §01.4).
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        display: ['var(--font-pixel)'],
        sans: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        showcase: ['var(--font-showcase)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
